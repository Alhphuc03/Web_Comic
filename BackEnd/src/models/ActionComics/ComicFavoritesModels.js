const mongoose = require("mongoose");

// Định nghĩa schema cho TV_Favorites

const comicFavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với model User
      required: true,
    },
    comicId: {
      type: String,
      required: true,
    },
    comicName: {
      type: String,
      required: true,
    },
    comicSlug: {
      type: String,
      required: true,
    },
    comicImg: {
      type: String,
      required: true,
    },
  },
  { collection: "Comic_Favorites" },
  { timestamps: true }
);

// Tạo model TvFavorites từ schema
const ComicFavorites = mongoose.model("Comic_Favorites", comicFavoriteSchema);

module.exports = ComicFavorites;
