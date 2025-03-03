const express = require("express");
const { login } = require("../controller/userController/authLoginController");
const {
  register,
} = require("../controller/userController/authSingUpController");
const {
  fetchAndSaveCategories,
  getCategories,
  deleteAllCategories,
} = require("../controller/categoryController/categoryController");

const {
  fetchAndSaveComicDetails,
  getComics,
  deleteAllComics,
} = require("../controller/comicController/comicController");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  userDetail,
} = require("../controller/userController/userDetailController");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controller/actionComicController/comicFavorites");

// API để login
router.post("/login", login);

// API để register
router.post("/register", register);

// API để lấy danh sách categories từ DB
router.get("/categories", getCategories);

// API để cập nhật danh sách categories từ nguồn bên ngoài (có thể chạy theo lịch trình)
router.post("/categories/update", fetchAndSaveCategories);

// Xóa tất cả categories
router.delete("/allcategories", deleteAllCategories);

router.post("/comics/update", fetchAndSaveComicDetails);

router.get("/comics", getComics);

router.delete("/allcomics", deleteAllComics);

router.get("/user-detail", auth, userDetail);

//Comic action
router.get("/favoritesComic/getFavorites", auth, getFavorites);
router.post("/favoritesComic/addFavorite", auth, addFavorite);
router.delete("/favoritesComic/deleteFavorite/:comicSlug", auth, removeFavorite);

module.exports = router;
