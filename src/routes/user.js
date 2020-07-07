const { Router } = require("express");
const User = require("../models/User");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.json(users);
  } catch (e) {
    res.status(500).render("index");
  }
});

router.get("/signup", async (req, res) => {
  if (req.isLoggedIn) {
    return res.redirect("/");
  }
  res.render("users/signup", {
    title: "إنشاء حساب",
    req,
  });
});

router.get("/signin", async (req, res) => {
  if (req.isLoggedIn) {
    return res.redirect("/");
  }
  res.render("users/signin", {
    title: "تسجيل الدخول",
    req,
  });
});

router.post("/signup", async (req, res) => {
  if (req.isLoggedIn) {
    return res.redirect("/");
  }
  if (req.body.password !== req.body.passwordRepeat) {
    return res.status(400).render("users/signup", {
      req,
      title: "إنشاء حساب",
      passwordRepeatError: true,
    });
  }
  try {
    const user = new User(req.body);
    await user.validate();
    const token = await user.generateAuthToken();
    await user.hashPass();
    await user.save();
    res.cookie("auth_token", token);
    res.redirect("/");
  } catch (e) {
    res.status(400).render("users/signup", {
      title: "إنشاء حساب",
      req,
      error: true,
      errors: e.errors,
      ...req.body,
    });
  }
});

router.post("/signin", async (req, res) => {
  if (req.isLoggedIn) {
    return res.redirect("/");
  }
  try {
    const user = await User.logIn(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    await user.save();
    res.cookie("auth_token", token);
    res.redirect("/");
  } catch (e) {
    res.render("users/signin", {
      title: "تسجيل الدخول",
      req,
      error: true,
    });
  }
});

router.get("/logout", async (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect("/");
  }
  try {
    const token = req.cookies["auth_token"];
    req.user.tokens = req.user.tokens.filter((t) => t.token !== token);
    await req.user.save();
    res.cookie("auth_token", "");
    console.log(req.cookies);
  } catch {}
  res.redirect("/");
});

module.exports = router;
