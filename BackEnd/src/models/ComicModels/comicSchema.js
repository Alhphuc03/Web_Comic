const mongoose = require("mongoose");

const comicSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    descriptionHead: { type: String, required: true },
    origin_name: [{ type: String }],
    content: { type: String },
    status: { type: String },
    thumb_url: { type: String },
    author: [{ type: String }],
    category: [{ type: String, ref: "Categories" }], // Lưu ID danh mục
    // chapters: [{ type: String, ref: "Chapters" }], // Lưu ID chương
  },
  { collection: "Comics", timestamps: true }
);

module.exports = mongoose.model("Comics", comicSchema);
