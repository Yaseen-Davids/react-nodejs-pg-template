const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/status", (req, res, next) => {
  return res.json({ status: "API IS RUNNING!" });
});

module.exports = router;
