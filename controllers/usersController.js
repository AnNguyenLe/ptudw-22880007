const { Address, Order, OrderDetail, Wishlist, Product } = require("../models");

const controller = {};

controller.checkout = async (req, res) => {
	if (req.session.cart.quantity > 0) {
		const userId = req.user.id;
		const addresses = await Address.findAll({
			where: { userId },
		});

		return res.render("checkout", {
			cart: req.session.cart.getCart(),
			addresses,
		});
	}
	res.redirect("/products");
};

controller.placeorders = async (req, res) => {
	const userId = req.user.id;
	//let { addressId, payment } = req.body;
	const addressId = isNaN(req.body.addressId)
		? 0
		: parseInt(req.body.addressId);
	let address = await Address.findByPk(addressId);
	if (!address) {
		address = await Address.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			mobile: req.body.mobile,
			address: req.body.address,
			country: req.body.country,
			city: req.body.city,
			state: req.body.state,
			zipCode: req.body.zipCode,
			isDefault: req.body.isDefault,
			userId,
		});
	}
	const cart = req.session.cart;
	cart.shippingAddress = `${address.firstName} ${address.lastName}, Email: ${address.email},
	Mobile: ${address.mobile}, Address: ${address.address}, ${address.city}, ${address.country}, ${address.state}, ${address.zipCode}`;
	cart.paymentMethod = req.body.payment;

	switch (req.body.payment) {
		case "PAYPAL":
			return saveOrders(req, res, "PAID");
		case "COD":
			return saveOrders(req, res, "UNPAID");
		default:
			break;
	}

	return res.redirect("/users/checkout");
};

const saveOrders = async (req, res, status) => {
	const userId = req.user.id;
	const { items, ...others } = req.session.cart.getCart();
	const order = await Order.create({
		userId,
		status,
		...others,
	});

	let orderDetails = [];
	items.forEach((item) => {
		orderDetails.push({
			orderId: order.id,
			productId: item.product.id,
			price: item.product.price,
			quantity: item.quantity,
			total: item.total,
		});
	});
	await OrderDetail.bulkCreate(orderDetails);
	req.session.cart.clear();
	return res.render("error", { message: "Thank you for your order!" });
};

controller.addToWishList = async (req, res) => {
	const product = await Wishlist.findOne({
		where: {
			userId: req.user.id,
			productId: req.body.productId,
		},
	});
	if (product) {
		return res.send("Product is already in wishlist");
	}

	await Wishlist.create({
		productId: req.body.productId,
		userId: req.user.id,
	});
	res.send("Added to wishlist!");
};

controller.showWishList = async (req, res) => {
	const products = await Wishlist.findAll({
		attributes: [],
		where: { userId: req.user.id },
		include: [
			{ model: Product, attributes: ["id", "name", "imagePath", "price"] },
		],
	});
	res.render("wishlist", {
		products,
	});
};

controller.deleteFromWishlist = async (req, res) => {
	const product = await Wishlist.findOne({
		where: {
			userId: req.user.id,
			productId: req.body.productId,
		},
	});

	if (product) {
		await Wishlist.destroy({
			where: {
				userId: req.user.id,
				productId: req.body.productId,
			},
		});
		return res.send("Product deleted from wishlist!");
	}

	res.send("This product is not in your wish list!");
};

module.exports = controller;
