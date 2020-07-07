const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  req.isLoggedIn = false;
  try {
    const token = req.cookies["auth_token"];
    if (!token) {
      req.isLoggedIn = false;
      return next();
    }
    const decode = jwt.verify(token, "auth");
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {
      req.isLoggedIn = false;
      return next();
    }

    req.user = user;
    req.token = token;
    req.isLoggedIn = true;
  } catch (e) {}
  next();
};
