const { Order, Product } = require("../schema/models");

const getProducts = async (req, res) => {
	const products = await Product.find({});
	return res.json({
		success: true,
		body: { message: `${products.length} product(s) fetched`, products },
	});
};

const placeOrder = async (req, res) => {
	const { productId, deliveryAddress, quantity } = req.body;
	if (!productId || !deliveryAddress || !quantity)
		return res.status(400).json({
			success: false,
			body: { message: "Incomplete information provided" },
		});
	if (isNaN(quantity) || quantity < 1)
		return res.status(400).json({
			success: false,
			body: { message: "Quantity should be atleast 1" },
		});
	const product = await Product.findById(productId);
	if (!product)
		return res.status(400).json({
			success: false,
			body: { message: "Product with the given ID does not exist" },
		});
	let order = new Order({
		userId: req.user._id,
		quantity: Number(quantity),
		totalPrice: Number(quantity) * product.price,
		productId,
		deliveryAddress,
	});
	order = await order.save();
	return res.json({ success: true, body: {message: 'Order placed', order} });
};

module.exports = {
	getProducts,
	placeOrder,
};