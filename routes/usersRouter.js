const express = require("express");
const router = express.Router();

const { checkout, placeorders } = require("../controllers/usersController");
const { body, validationResult } = require("express-validator");
const  {isLoggedIn} = require("../controllers/authController");

router.use(isLoggedIn)
router.get("/checkout", checkout);
router.post(
	"/placeorders",
	body("firstName").notEmpty().withMessage("First name is required"),
	body("lastName").notEmpty().withMessage("Last name is required"),
	body("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email format."),
	body("mobile").notEmpty().withMessage("Mobile is required"),
	body("address").notEmpty().withMessage("Address is required"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (req.body.addressId === "0" && !errors.isEmpty()) {
			const errorArray = errors.array();
			let message = "";
			for (let i = 0; i < errorArray.length; i++) {
				message += errorArray[i].msg + "<br/>";
			}

			return res.render("error", { message });
		}
		next();
	},
	placeorders
);

router.get("/my-account", (req, res) => {
	res.render("my-account");
});

module.exports = router;
