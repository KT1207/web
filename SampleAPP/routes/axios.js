var express = require("express");
var multer = require("multer");
const database = require("../models/sqlite-db");
const sql = require("../models/memo-sql");
const { locals } = require("../app");
var router = express.Router();
/* GET home page. */

router.get("/", (req, res) => {
  res.render("axios");
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.post("/apiUpload/:userid", upload.single("file"), (req, res) => {
  try {
    const { title, message } = req.body;
    let originalFileName = "";
    let fileUrl = "";
    if (req.file) {
      originalFileName = req.file.originalname;
      fileUrl = "/uploads/" + req.file.filename;
    }

    const memo = {
      userid: `${req.userid}`,
      title: `${title}`,
      content: `${message}`,
      originalFileName: `${originalFileName}`,
      fileUrl: `${fileUrl}`,
      savedTime: `${new Date().getTime()}`,
    };

    database.executeUpdate(sql.insertMemoSql(memo));

    res.json({
      title: title,
      message: message,
      originalFileName: originalFileName,
      fileUrl: fileUrl,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
