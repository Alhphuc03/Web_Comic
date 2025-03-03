const axios = require("axios");
const Category = require("../../models/CategorieModels/CategorieSchema");
const CONFIG = require("../../config/config");

// Hàm lấy dữ liệu từ API và cập nhật vào MongoDB
const fetchAndSaveCategories = async () => {
  try {
    const response = await axios.get(CONFIG.API_URLS.CATEGORIES);

    if (response.data.status !== "success") {
      console.error("Lỗi khi lấy dữ liệu từ API");
      return;
    }

    const categoriesFromApi = response.data.data.items;

    // Lưu hoặc cập nhật danh mục từ API
    for (const item of categoriesFromApi) {
      await Category.findOneAndUpdate(
        { id: item._id }, // Tìm category theo ID
        { id: item._id, name: item.name, slug: item.slug }, // Cập nhật dữ liệu mới
        { upsert: true, new: true }
      );
    }

    console.log("Cập nhật danh mục thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
  }
};

// Lấy danh sách categories từ MongoDB
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ status: "success", data: categories });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Hàm xóa tất cả các danh mục
const deleteAllCategories = async (req, res) => {
  try {
    await Category.deleteMany({}); // Xóa tất cả các document trong collection
    res.json({ status: "success", message: "Đã xóa tất cả danh mục" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa tất cả danh mục" });
  }
};

module.exports = { fetchAndSaveCategories, getCategories, deleteAllCategories };
