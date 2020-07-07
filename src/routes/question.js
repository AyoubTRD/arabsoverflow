const { Router } = require("express");

const Question = require("../models/Question");
const Tag = require("../models/Tag");

const router = Router();

const { formatDistanceToNow } = require("date-fns");
const { arMA } = require("date-fns/locale");

router.get("/create", async (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect("/");
  }
  res.render("create_question", {
    req,
    title: "طرح سؤال",
  });
});

router.post("/", async (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect("/");
  }
  if (!req.body.tags) {
    return res.status(400).render("create_question", {
      title: "طرح سؤال",
      req,
      errors: { tags: "المرجو إدخال موضوع واحد على الأقل " },
      error: true,
      ...req.body,
    });
  }
  const tags = req.body.tags.split(",");
  try {
    await Tag.insertMany(
      tags.map((tag) => ({ name: tag })),
      { ordered: false }
    ).catch(() => {});

    const tagIds = await Tag.find({ name: { $in: tags } })
      .select({ _id: 1 })
      .lean();

    const question = new Question({
      ...req.body,
      tags: tagIds.map((tag) => tag._id),
      author: req.user._id,
    });
    await question.save();
    res.redirect("/");
  } catch (e) {
    res.status(400).render("create_question", {
      title: "طرح سؤال",
      req,
      errors: e.errors,
      error: true,
      ...req.body,
    });
  }
});

router.get("/:id", async (req, res) => {
  const questionId = req.params.id;

  try {
    const question = await Question.findById(questionId)
      .populate("author")
      .populate("tags")
      .lean()
      .exec();
    if (!question) {
      return res.status(404).render("404", {
        req,
      });
    }
    res.render("question", {
      formatDistanceToNow,
      arMA,
      question,
      req,
    });
  } catch (e) {
    // Tanket, rak fahem
    res.status(500).render("error", {
      req,
    });
  }
});

module.exports = router;
