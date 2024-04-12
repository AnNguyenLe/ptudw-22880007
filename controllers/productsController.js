const controller = {};

const {
	Product,
	Category,
	Brand,
	Tag,
	Image,
	Review,
	User,
} = require("../models");
const { Op } = require("sequelize");

controller.initSidebar = async (req, res, next) => {
	const categories = await Category.findAll({
		include: [{ model: Product, attributes: ["id"] }],
	});
	res.locals.categories = categories;

	const brands = await Brand.findAll({
		include: [{ model: Product, attributes: ["id"] }],
	});
	res.locals.brands = brands;

	const tags = await Tag.findAll();
	res.locals.tags = tags;

	next();
};

controller.show = async (req, res) => {
	const options = {
		attributes: ["id", "name", "imagePath", "stars", "oldPrice", "price"],
		include: [],
		where: {},
	};

	const category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
	if (category > 0) {
		options.where.categoryId = category;
	}

	const brand = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);
	if (brand > 0) {
		options.where.brandId = brand;
	}

	const tag = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
	if (tag > 0) {
		options.include.push({ model: Tag, where: { id: tag } });
	}

	const keyword = req.query.keyword || "";
	if (keyword.trim() !== "") {
		options.where.name = { [Op.iLike]: `%${keyword}%` };
	}

	const sort = ["price", "newest", "popular"].includes(req.query.sort)
		? req.query.sort
		: "price";

	let originalUrl = removeParam("sort", req.originalUrl);
	if (Object.keys(req.query).length == 0) {
		originalUrl += "?";
	}

	switch (sort) {
		case "newest":
			options.order = [["createdAt", "DESC"]];
			break;
		case "popular":
			options.order = [["stars", "DESC"]];
			break;
		default:
			options.order = [["price", "ASC"]];
	}

	const page = isNaN(req.query.page)
		? 1
		: Math.max(1, parseInt(req.query.page));
	const limit = 6;
	options.limit = limit;
	options.offset = limit * (page - 1);

	const { rows: products, count } = await Product.findAndCountAll(options);
	const pagination = {
		page,
		limit,
		totalRows: count,
		queryParams: req.query,
	};

	res.render("product-list", {
		products,
		originalUrl,
		sort,
		pagination,
	});
};

controller.showDetails = async (req, res) => {
	const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

	const product = await Product.findOne({
		attributes: [
			"id",
			"name",
			"stars",
			"price",
			"oldPrice",
			"summary",
			"description",
			"specification",
		],
		where: { id },
		include: [
			{ model: Image, attributes: ["name", "imagePath"] },
			{
				model: Review,
				attributes: ["id", "review", "stars", "updatedAt"],
				include: [{ model: User, attributes: ["firstName", "lastName"] }],
			},
			{ model: Tag, attributes: ["id"] },
		],
	});

	const tagIds = [];
	product.Tags.forEach((tag) => tagIds.push(tag.id));

	const relatedProducts = await Product.findAll({
		attributes: ["id", "name", "imagePath", "oldPrice", "price"],
		include: [
			{
				model: Tag,
				attributes: ["id"],
				where: {
					id: { [Op.in]: tagIds },
				},
			},
		],
		limit: 10,
	});

	res.render("product-detail", {
		product,
		relatedProducts,
	});
};

function removeParam(key, sourceURL) {
	var rtn = sourceURL.split("?")[0],
		param,
		params_arr = [],
		queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
	if (queryString !== "") {
		params_arr = queryString.split("&");
		for (var i = params_arr.length - 1; i >= 0; i -= 1) {
			param = params_arr[i].split("=")[0];
			if (param === key) {
				params_arr.splice(i, 1);
			}
		}
		if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
	}
	return rtn;
}

module.exports = controller;
