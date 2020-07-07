const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "عنوان السؤال مطلوب"],
    },
    body: {
      type: String,
      required: [true, "هذا الحقل مطلوب"],
    },
    answers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Answer",
      },
    ],
    tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
