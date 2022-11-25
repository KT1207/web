var express = require("express");
var multer = require("multer");
const db = require("../models/sqlite-db");
const sql = require("../models/memo-sql");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  db.executeQuery(sql.selectAllMemoSql(), (err, rows) => {
    if (err) {
      res.render("error", { message: err.message, error: err });
    } else {
      res.render("menu", { menus: rows });
    }
  });
});

router.get("/modify/:menuId", function (req, res, next) {
  res.render("modify");
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

router.post("/modify/:menuid", upload.single("file"), (req, res, next) => {
  console.log("ASDF");
  try {
    const menuId = req.params.menuId;
    const { title, message } = req.body;
    let fileUrl = "";
    let originalFileName = "";
    if (req.file) {
      originalFileName = req.file.originalname;
      fileUrl = "/uploads/" + req.file.filename;
    }

    const memo = {
      memoid: `${req.params.menuid}`,
      title: `${title}`,
      content: `${message}`,
      originalFileName: `${originalFileName}`,
      fileUrl: `${fileUrl}`,
      savedTime: `${new Date().getTime()}`,
    };

    db.executeUpdate(sql.updateMemoSql(memo));

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
