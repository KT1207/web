var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/" || "/KTLITER", function (req, res, next) {
  res.render("KTLITER");
});

module.exports = router;
