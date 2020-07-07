const { Router } = require("express");

const router = Router();
const Question = require("../models/Question");

const { formatDistanceToNow } = require("date-fns");
const { arMA } = require("date-fns/locale");

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({})
      .sort({ createdAt: -1 })
      .populate("tags")
      .populate("author")
      .lean()
      .exec();
    res.render("index", {
      title: "Home",
      req,
      questions,
      formatDistanceToNow,
      arMA,
    });
  } catch (e) {
    console.log(e);
  }
});
router.use("/users", require("./user"));
router.use("/questions", require("./question"));
router.use("/tags", require("./tag"));

module.exports = router;
