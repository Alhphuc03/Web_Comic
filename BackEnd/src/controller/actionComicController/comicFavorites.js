// controller/favorites/favoritesController.js
const ComicFavorites = require("../../models/ActionComics/ComicFavoritesModels");

// Lấy danh sách phim yêu thích của người dùng
const getFavorites = async (req, res) => {
  try {
    const favorites = await ComicFavorites.find({
      userId: req.user.id, // Sử dụng req.user.userId
    }).populate("userId", "username email avatar");

    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const addFavorite = async (req, res) => {
  const { comicId, comicName, comicSlug, comicImg } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  // Kiểm tra xem comicName và comicImg có bị thiếu không
  if (!comicId || !comicName || !comicImg) {
    return res.status(400).json({ msg: "Thiếu thông tin truyện yêu thích" });
  }

  try {
    const favorite = new ComicFavorites({
      userId: req.user.id,
      comicId,
      comicName,
      comicSlug,
      comicImg,
    });

    await favorite.save();
    res.status(201).json({ msg: "Thêm yêu thích thành công", favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Xóa phim khỏi danh sách yêu thích
const removeFavorite = async (req, res) => {
  const { comicSlug } = req.params;

  try {
    const favorite = await ComicFavorites.findOneAndDelete({
      userId: req.user.id,
      comicSlug,
    });
    if (!favorite) {
      return res.status(404).json({ msg: "Favorite not found" });
    }
    res.json({ msg: "Đã xóa truyện yêu thích thành công", favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
