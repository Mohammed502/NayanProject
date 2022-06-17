const { Router } = require("express");
const {
	getProducts,
	initiateOrder,
	confirmOrder,
} = require("../controllers/productController");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.get("/getProducts", getProducts);
router.post("/initiateOrder", verifyAccessToken, initiateOrder);
router.post('/confirmOrder', verifyAccessToken, confirmOrder);

module.exports = router;