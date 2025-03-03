const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { collection: "Categories" }
);

const Category = mongoose.model("Categories", categorySchema);

module.exports = Category;
