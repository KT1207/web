var express = require("express");

const db = require("../models/sqlite-db");
const sql = require("../models/user-sql");
const memoSql = require("../models/memo-sql");
var router = express.Router();
/* GET home page. */
router.get("/" || "/index", function (req, res, next) {
  res.render("index");
});
try {
  const user = { userid: `admin`, password: `1234` };
  console.log(user.userid);
  console.log(user.password);
  db.executeUpdate(sql.insertUser(user));
} catch (error) {
  console.log("error " + error);
}
module.exports = router;
