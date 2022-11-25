var express = require("express");
var router = express.Router();
const db = require("../models/sqlite-db");
const sql = require("../models/user-sql");
const memoSql = require("../models/memo-sql");
const authMiddleware = require("../middleware/auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("login");
});

router.post("/", function (req, res, next) {
  const user = req.body;
  console.log(res.body.id);
  console.log(res.body.password);

  if (!user || !user.userid || !user.password) {
    res.status(400).json({ error: "Invalid request." });
  }
  db.executeUpdate(sql.insertUser(user));

  res.end("");
});
// close the database connection

/*
router.post("/login", (res, req) => {
  jwt.verify("헤더에서 받아온 토큰", "프로젝트이름", (err) => {
    if (err) {
      console.log(err);
      return res.redirect("http://localhost:3000");
    } else {
      next();
    }
  });
});
*/
module.exports = router;
