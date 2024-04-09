const helpers = {};

helpers.createStarList = (stars) => {
	const star = Math.floor(stars);
	const half = stars - star;
	let str = '<div class="ratting">';

	let i;
	for (i = 0; i < star; i++) {
		str += '<i class="fa fa-star"></i>';
	}

	if (half > 0) {
		str += '<i class="fa fa-star-half-o"></i>';
		i++;
	}

	for (; i < 5; i++) {
		str += '<i class="fa fa-star-o"></i>';
	}
	return str + "</div>";
};

helpers.formatDate = (date) => {
	return date.toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};
module.exports = helpers;
