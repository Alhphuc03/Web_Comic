const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // ObjectId thay vì String
    comic_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comics",
      required: true,
      index: true,
    }, // Thêm ref + index
    filename: { type: String, required: true },
    chapter_name: { type: String, required: true },
    chapter_title: { type: String },
    chapter_api_data: { type: String, required: true },
  },
  { collection: "Chapters", timestamps: true }
);

module.exports = mongoose.model("Chapters", chapterSchema);
