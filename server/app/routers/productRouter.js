const { Router } = require("express");
const {
	getProducts,
	placeOrder
} = require("../controllers/productController");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.get("/getProducts", getProducts);
router.post("/placeOrder", verifyAccessToken, placeOrder);

module.exports = router;