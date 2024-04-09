const controller = {};

const { Product } = require("../models");

controller.addToCart = async (req, res) => {
	let id = isNaN(req.body.id) ? 0 : parseInt(req.body.id);

	let quantity = isNaN(req.body.quantity) ? 0 : parseInt(req.body.quantity);

	let product = await Product.findByPk(id);

	if (product && quantity > 0) {
		req.session.cart.add(product, quantity);
	}

	return res.json({ quantity: req.session.cart.quantity });
};

controller.showCart = (req, res) => {
	res.render("cart", {
		cart: req.session.cart.getCart(),
	});
};

controller.updateCart = (req, res) => {
	let id = isNaN(req.body.id) ? 0 : parseInt(req.body.id);

	let quantity = isNaN(req.body.quantity) ? 0 : parseInt(req.body.quantity);

	if (quantity > 0) {
		const updatedItem = req.session.cart.update(id, quantity);

		return res.json({
			item: updatedItem,
			quantity: req.session.cart.quantity,
			total: req.session.cart.total,
			subtotal: req.session.cart.subtotal,
		});
	}
	res.sendStatus(204).end();
};

controller.removeItemInCart = (req, res) => {
	const id = isNaN(req.body.id) ? 0 : parseInt(req.body.id);
	req.session.cart.remove(id);
	return res.json({
		quantity: req.session.cart.quantity,
		subtotal: req.session.cart.subtotal,
		total: req.session.cart.total,
	})
};

controller.clearCart = (req, res) => {
	req.session.cart.clear();
	return res.sendStatus(200).end();
}

module.exports = controller;
