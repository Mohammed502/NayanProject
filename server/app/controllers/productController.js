const { Order, Product } = require("../schema/models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const getProducts = async (req, res) => {
	const products = await Product.find({});
	return res.json({
		success: true,
		body: { message: `${products.length} product(s) fetched`, products },
	});
};

const initiateOrder = async (req, res) => {
	const { productId, deliveryAddress, contactNumber, quantity } = req.body;
	if (!productId || !deliveryAddress || !quantity || !contactNumber)
		return res.status(400).json({
			success: false,
			body: { message: "Incomplete information provided" },
		});
	if (isNaN(quantity) || quantity < 1)
		return res.status(400).json({
			success: false,
			body: { message: "Quantity should be atleast 1" },
		});
	if (
		isNaN(contactNumber) ||
		String(contactNumber).length !== 10 ||
		!["9", "8", "7", "6"].includes(String(contactNumber)[0])
	)
		return res.status(400).json({
			success: false,
			body: { message: "Invalid contact number" },
		});
	const product = await Product.findById(productId);
	if (!product)
		return res.status(400).json({
			success: false,
			body: { message: "Product with the given ID does not exist" },
		});
	let order = {
		userId: req.user._id,
		quantity: Number(quantity),
		totalPrice: Number(quantity) * product.price,
		productId,
		deliveryAddress,
		contactNumber: Number(contactNumber),
	};
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items: [
				{
					price_data: {
						currency: "inr",
						product_data: {
							name: product.name,
						},
						unit_amount: Number(quantity) * product.price * 10,
					},
					quantity,
				},
			],
			success_url: "http://localhost:3000/confirmOrder",
			cancel_url: "http://localhost:3000",
		});
		const paymentIntent = await stripe.paymentIntents.retrieve(
			session.payment_intent
		);
		const orderToken = jwt.sign(order, ACCESS_TOKEN_SECRET);
		res.cookie("orderToken", orderToken, {
			sameSite: "None",
			secure: true,
		});
		res.json({
			success: true,
			body: {
				url: session.url,
				clientSecret: paymentIntent["client_secret"],
			},
		});
	} catch (err) {
		res.json({ success: false, body: { message: err.message } }).status(
			501
		);
	}
};

const confirmOrder = async (req, res) => {
	const { orderToken } = req.cookies;
	if (!orderToken)
		return res.json({
			success: false,
			body: { message: "No order token" },
		});
	jwt.verify(orderToken, ACCESS_TOKEN_SECRET, async (err, _order) => {
		if (err)
			return res.json({
				success: false,
				body: { message: "Invalid order token" },
			});
		let order = new Order(_order);
		order = await order.save();
		res.clearCookie("orderToken");
		return res.json({
			success: true,
			body: { message: "Order placed", order },
		});
	});
};

module.exports = {
	getProducts,
	initiateOrder,
	confirmOrder,
};
