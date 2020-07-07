const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tag = mongoose.model("Tag", tagSchema);

// const tags = ["Tag 1", "Tag 2", "Loeuf"];

// Tag.insertMany(
//   tags.map((tag) => ({ name: tag })),
//   { ordered: false }
// ).catch(() => {});

// Tag.find({ name: { $in: tags } })
//   .select({ _id: 1 })
//   .lean()
//   .then((res) => {
//     console.log(res);
//   });

module.exports = Tag;
