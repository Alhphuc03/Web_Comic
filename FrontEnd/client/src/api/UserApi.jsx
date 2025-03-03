import axios from "axios";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL_BE = import.meta.env.VITE_URL_BASE_BE;
const userApi = {
  Register: async (userData) => {
    console.log("Dữ liệu gửi đi:", userData);
    try {
      const response = await axios.post(`${BASE_URL_BE}/register`, userData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },
  Login: async (loginData) => {
    console.log("Dữ liệu đăng nhập:", loginData);
    try {
      const response = await axios.post(`${BASE_URL_BE}/login`, loginData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },
  getUserDetails: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL_BE}/user-detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

const ComicAction = {
  getFavorites: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL_BE}/favoritesComic/getFavorites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      throw new Error("Error fetching favorites");
    }
  },

  addFavorite: async (comicId, comicName, comicSlug, comicImg, token) => {
    try {
      const response = await axios.post(
        `${BASE_URL_BE}/favoritesComic/addFavorite`,
        { comicId, comicName, comicSlug, comicImg },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      throw new Error("Error adding to favorites");
    }
  },

  removeFavorite: async (comicSlug, token) => {
    try {
      const response = await axios.delete(
        `${BASE_URL_BE}/favoritesComic/deleteFavorite/${comicSlug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      throw new Error("Error removing from favorites");
    }
  },
};
// 🆕 API cho Lịch sử đọc truyện
const ReadingHistoryApi = {
  // Lưu lịch sử đọc (cập nhật chapter mới nhất)
  saveReadingHistory: async (comicSlug, chapterName, token) => {
    try {
      const response = await axios.post(
        `${BASE_URL_BE}/history/save`,
        { comicSlug, chapterName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },

  // Lấy chương gần nhất đã đọc của một truyện

  getLastReadChapter: async (comicSlug, token) => {
    try {
      const response = await axios.get(
        `${BASE_URL_BE}/history/last-read?comicSlug=${comicSlug}`, // Sửa lại đường dẫn chính xác
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },
};

export { userApi, ComicAction, ReadingHistoryApi };
