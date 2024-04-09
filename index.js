const express = require("express");
const path = require("path");
const expressHbs = require("express-handlebars");
const { createPagination } = require("express-handlebars-paginate");

const session = require("express-session");
const redisStore = require("connect-redis").default;
const { createClient } = require("redis");
const redisClient = createClient({
	// url: "rediss://red-coabb14f7o1s73dnb4vg:S4hNdW4cBSZOjb6t6szL1OaJzFyFx1pl@singapore-redis.render.com:6379",
	url: "redis://red-coabb14f7o1s73dnb4vg:6379",
});
redisClient.connect().catch(console.error);

const app = express();
const port = process.env.port || 3000;

app.use(express.static(path.join(__dirname, "/public")));

app.engine(
	"hbs",
	expressHbs.engine({
		extname: "hbs",
		defaultLayout: path.join(__dirname, "/views/layouts/main.hbs"),
		layoutsDir: path.join(__dirname, "/views/layouts"),
		partialsDir: path.join(__dirname, "views/partials"),
		runtimeOptions: {
			allowProtoPropertiesByDefault: true,
		},
		helpers: {
			...require("./controllers/handlebarsHelpers"),
			createPagination,
		},
	})
);
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ urlencoded: false }));

app.use(
	session({
		secret: "S3cret",
		store: new redisStore({ client: redisClient }),
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 20 * 60 * 1000, // 20 minutes
		},
	})
);

app.use((req, res, next) => {
	let Cart = require("./controllers/cart");
	req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
	res.locals.quantity = req.session.cart.quantity;
	next();
});

app.use("/products", require("./routes/productsRouter"));

app.use("/users", require("./routes/usersRouter"));

app.use("/", require("./routes/indexRouter"));

app.use((req, res, next) => {
	res.status(404).render("error", { message: "File Not Found!" });
});

app.use((error, req, res, next) => {
	console.error(error);
	res.status(500).render("error", { message: "Internal Server Error!" });
});

app.listen(port, () => {
	console.log(`Server is listening at port ${port}`);
});
