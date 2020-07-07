const mongoose = require("mongoose");
const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { EMAIL_EXP } = require("../util/regex");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "الإسم الشخصي مطلوب"],
      maxlength: [32, "الإسم الشخصي لا يمكن أن يكون أطول من 32 حرف"],
    },
    lastName: {
      type: String,
      required: [true, "الإسم العائلي مطلوب"],
      maxlength: [32, "الإسم العائلي لا يمكن أن يكون أطول من 32 حرف"],
    },
    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: [true, "هذا البريد الإلكتروني على قيد الاستعمال من طرف حساب آخر"],
      lowercase: true,
      match: [EMAIL_EXP, "هذا البريد الإلكتروني غير صحيح"],
    },
    password: {
      type: String,
      required: [true, "كلمة السر مطلوبة"],
      minlength: [6, "كلمة السر لا يمكن أن تكون أقصر من 6 أحرف"],
    },
    points: {
      type: Number,
      default: 0,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const { _doc: user } = this;
  return { ...user, password: undefined, tokens: undefined, email: undefined };
};

userSchema.methods.toAuthJSON = function () {
  const { _doc: user } = this;
  return { ...user, password: undefined, tokens: undefined };
};

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, "auth");
  this.tokens = [...this.tokens, { token }];
  return token;
};

userSchema.statics.logIn = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("cannot login");
  }
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    throw new Error("cannot login");
  }
  return user;
};

userSchema.methods.hashPass = async function () {
  try {
    const passHash = await hash(this.password, 8);
    this.password = passHash;
  } catch (err) {
    throw new Error("an error occured!");
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
