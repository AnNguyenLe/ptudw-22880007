const express = require("express");
const router = express.Router();

const { showHomepage, showPage } = require("../controllers/indexController");
router.get("/", showHomepage);

router.get("/:page", showPage);

module.exports = router;
