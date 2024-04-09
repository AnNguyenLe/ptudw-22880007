const { Address, Order, OrderDetail } = require("../models");

const controller = {};

controller.checkout = async (req, res) => {
	if (req.session.cart.quantity > 0) {
		const userId = 1;
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
	const userId = 1;
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
	const userId = 1;
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

module.exports = controller;
