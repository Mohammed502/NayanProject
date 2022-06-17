require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/* password */

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
	const isValid = await bcrypt.compare(password, hashedPassword);
	return isValid;
};

/* access token */

const generateAccessToken = (user) => {
	return jwt.sign(
		{
			_id: user._id,
			username: user.username,
			password: user.password,
		},
		ACCESS_TOKEN_SECRET
	);
};

const verifyAccessToken = async (req, res, next) => {
	const { _id } = req.params;
	const { accessToken } = req.cookies;
	if (!accessToken)
		return res
			.status(401)
			.json({ success: false, body: { message: "No access token" } });
	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, user) => {
		if (err || (_id && _id !== user._id))
			return res.status(401).json({
				success: false,
				body: { message: "Invalid access token" },
			});
		req.user = user;
		next();
	});
};

module.exports = {
	hashPassword,
	comparePassword,
	generateAccessToken,
	verifyAccessToken,
};