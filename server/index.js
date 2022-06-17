const express = require('express');
const mongoose=require('mongoose')
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require('./app/routers/authRouter');
const productRouter = require('./app/routers/productRouter');

require("dotenv").config();
/* central server setup */

const app = express()
const port = process.env.PORT || 10000;

/* middlewares */

app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: [
			"http://localhost:3000",
		],
		credentials: true,
		sameSite: "None",
		secure: true,
	})
);
app.use(express.static("public"));

/* mongodb database connection */

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.connection.on("error", () => {
	console.log("Error connecting to database");
});
mongoose.connection.on("open", () => {
	console.log("Connected to database");
});
module.exports = mongoose.connection;

/* api */

app.use("/auth", authRouter);
app.use("/product", productRouter);

/* making the app listen to a port */

app.listen(port, () => {
	console.log(`App listening port ${port}`);
});