const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	email: String,
	username: String,
	password: String,
});

const productSchema = new Schema({
	name: String,
	description: String,
	price: Number,
	image: String
});

const orderSchema = new Schema({
	productId: { type: Schema.Types.ObjectId, ref: "Product" },
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	quantity: Number,
	deliveryAddress: String,
	totalPrice: Number,
	contactNumber: Number,
});

module.exports = {
	User: model("User", userSchema),
	Product: model("Product", productSchema),
	Order: model("Order", orderSchema),
};