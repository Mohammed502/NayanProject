const { User } = require("../schema/models");
const {
	hashPassword,
	comparePassword,
	generateAccessToken,
} = require("../utils/auth");
const emailValidator = require('email-validator');

const signup = async (req, res) => {
	const { email, username, password, confirmPassword } = req.body;
	if (!email || !username || !password)
		return res.status(400).json({
			success: false,
			body: { message: "Credentials not provided" },
		});
	if(!emailValidator.validate(email)) 
		return res.status(400).json({
			succes: false,
			body: { message: "Invalid email" },
		});
	if (username.length < 6)
		return res.status(400).json({
			succes: false,
			body: { message: "Username should be 6 characters long" },
		});
	if (password.length < 8)
		return res.status(400).json({
			succes: false,
			body: { message: "Password should be 8 characters long" },
		});
	if(password !== confirmPassword) 
		return res.status(400).json({
			succes: false,
			body: { message: "Passwords do not match" },
		});
	let user = await User.findOne({ email });
	if (user)
		return res.status(401).json({
			succes: false,
			body: { message: "User already exists with the given email" },
		});
	const hashedPassword = await hashPassword(password);
	user = new User({ email, username, password: hashedPassword });
	user = await user.save();

	const accessToken = generateAccessToken(user);
	res.cookie("accessToken", accessToken, { sameSite: "None", secure: true });

	return res.json({
		success: true,
		body: { message: "Signed up successfully", user },
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).json({
			success: false,
			body: { message: "Credentials not provided" },
		});

	const user = await User.findOne({ email });
	if (!user)
		return res.status(400).json({
			success: false,
			body: { message: "User does not exist with given email" },
		});
	if (!(await comparePassword(password, user.password)))
		return res
			.status(403)
			.json({ success: false, body: { message: "Incorrect password" } });

	const accessToken = generateAccessToken(user);
	res.cookie("accessToken", accessToken, { sameSite: "None", secure: true });

	res.json({
		success: true,
		body: { message: "Logged in successfully", user },
	});
};

const refresh = async (req, res) => {
	const user = await User.findById(req.user._id);
	res.json({
		success: true,
		body: { message: "Token was verified", user },
	});
};

const logout = async (req, res) => {
	res.clearCookie("accessToken");
	res.json({ success: true, body: { message: "Logged out successfully" } });
};

module.exports = {
	signup,
	login,
	refresh,
	logout,
};