const express = require("express");
const router = express.Router();

const {
	initSidebar,
	show,
	showDetails,
} = require("../controllers/productsController");

const { addToCart, showCart, updateCart, removeItemInCart, clearCart } = require("../controllers/cartController");

router.get("/cart", showCart);
router.post("/cart", addToCart);
router.put("/cart", updateCart)
router.delete("/cart", removeItemInCart);
router.delete("/cart/all", clearCart)

router.get("/:id", initSidebar, showDetails);

router.get("/", initSidebar, show);

module.exports = router;
