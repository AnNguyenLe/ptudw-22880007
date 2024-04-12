const controller = {};

const { Brand, Category, Product } = require("../models");

controller.showHomepage = async (req, res) => {
	const recentProducts = await Product.findAll({
		attributes: [
			"id",
			"name",
			"imagePath",
			"stars",
			"oldPrice",
			"price",
			"createdAt",
		],
		order: [["createdAt", "DESC"]],
		limit: 10,
	});
	const featuredProducts = await Product.findAll({
		attributes: ["id", "name", "imagePath", "stars", "oldPrice", "price"],
		order: [["stars", "DESC"]],
		limit: 10,
	});
	const categories = await Category.findAll();
	const categoryArr = [
		[categories[0]],
		[categories[2], categories[3]],
		[categories[1]],
	];
	const brands = await Brand.findAll();
	res.render("index", {
		featuredProducts,
		categoryArr,
		brands,
		recentProducts,
	});
};

controller.showPage = (req, res, next) => {
	const pages = ["contact", "login"];
	const pageName = req.params.page;
	if (pages.includes(pageName)) {
		return res.render(req.params.page);
	}
	next();
};

module.exports = controller;
