const express = require("express");
const router = express.Router();

const {
	show,
	login,
	logout,
	register,
	showForgotPassword,
	forgotPassword,
	showResetPassword,
	resetPassword,
} = require("../controllers/authController");

const { body, getErrorMessage } = require("../controllers/validator");

router.get("/login", show);

router.post(
	"/login",
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required!")
		.isEmail()
		.withMessage("Invalid email address!"),
	body("password").trim().notEmpty().withMessage("Password is required!"),
	(req, res, next) => {
		const message = getErrorMessage(req);
		if (message) {
			return res.render("login", { loginMessage: message });
		}
		next();
	},
	login
);

router.get("/logout", logout);

router.post(
	"/register",
	body("firstName").trim().notEmpty().withMessage("First Name is required!"),
	body("lastName").trim().notEmpty().withMessage("Last Name is required!"),
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required!")
		.isEmail()
		.withMessage("Invalid Email address!"),
	body("password").trim().notEmpty().withMessage("Password is required!"),
	body("password")
		.matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
		.withMessage(
			"Password MUST contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
		),
	body("confirmPassword").custom((confirmPassword, { req }) => {
		if (confirmPassword !== req.body.password) {
			throw new Error("Passwords do not match!");
		}
		return true;
	}),
	(req, res, next) => {
		const message = getErrorMessage(req);
		if (message) {
			return res.render("login", { registerMessage: message });
		}
		next();
	},
	register
);

router.get("/forgot", showForgotPassword);

router.post(
	"/forgot",
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required!")
		.isEmail()
		.withMessage("Invalid email format"),
	(req, res, next) => {
		const message = getErrorMessage(req);
		if (message) {
			return res.render("forgot-password", { message });
		}
		next();
	},
	forgotPassword
);

router.get("/reset", showResetPassword);

router.post(
	"/reset",
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required!")
		.isEmail()
		.withMessage("Invalid Email address!"),
	body("password").trim().notEmpty().withMessage("Password is required!"),
	body("password")
		.matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
		.withMessage(
			"Password MUST contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
		),
	body("confirmPassword").custom((confirmPassword, { req }) => {
		if (confirmPassword !== req.body.password) {
			throw new Error("Passwords do not match!");
		}
		return true;
	}),
	(req, res, next) => {
		const message = getErrorMessage(req);
		if (message) {
			return res.render("reset-password", { message });
		}
		next();
	},
	resetPassword
);

module.exports = router;
