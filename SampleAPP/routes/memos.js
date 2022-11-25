const express = require("express");
const router = express.Router();
const db = require("../models/sqlite-db");
const sql = require("../models/memo-sql");

const multer = require("multer");
const parser = require("body-parser");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
  db.executeQuery(sql.selectAllMemoByUserSql(req.userid), (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.render("menu", { menus: rows });
    }
  });
});

router.post("/", upload.single("file"), function (req, res, next) {
  const memo = req.body;
  memo.title = memo.title.replace(/\"/g, "");
  memo.content = memo.content.replace(/\"/g, "");
  memo.userid = req.userid;
  memo.savedTime = Date.now();
  if (req.file) {
    memo.originalFileName = req.file.originalname;
    memo.fileUrl = "uploads/" + req.file.filename;
  } else {
    memo.originalFileName = null;
    memo.fileUrl = null;
  }
  db.executeUpdate(sql.insertMemoSql(memo));
  res.end("");
});

router.get("/:memoid", function (req, res, next) {
  db.executeQuery(
    sql.selectOneMemoSql(req.params.memoid, req.userid),
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows[0]);
      }
    }
  );
});

router.put("/:memoid", upload.single("file"), function (req, res, next) {
  const memo = req.body;
  memo.title = memo.title.replace(/\"/g, "");
  memo.content = memo.content.replace(/\"/g, "");
  memo.memoid = req.params.memoid;
  memo.savedTime = Date.now();
  if (req.file) {
    memo.originalFileName = req.file.originalname;
    memo.fileUrl = "uploads/" + req.file.filename;
  } else {
    memo.originalFileName = null;
    memo.fileUrl = null;
  }
  console.log(memo);
  db.executeUpdate(sql.updateMemoSql(memo));
  res.end("");
});

router.delete("/delete/:memoid", function (req, res, next) {
  console.log(db.executeUpdate(sql.deleteMemoSql(req.params.memoid)));
  db.executeUpdate(sql.deleteMemoSql(req.params.memoid));
  res.end("");
});

module.exports = router;
