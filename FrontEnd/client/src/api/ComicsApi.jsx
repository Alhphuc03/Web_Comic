import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL_BE = import.meta.env.VITE_URL_BASE_BE;
const comicsApi = {
  getHome: async () => {
    const response = await axios.get(`${BASE_URL}/home`);
    return response.data;
  },

  getDanhSach: async (page) => {
    const response = await axios.get(`${BASE_URL}/danh-sach?page${page}`);
    return response.data;
  },

  getDanhSachTruyen: async (type) => {
    const response = await axios.get(`${BASE_URL}/danh-sach/${type}`);
    return response.data;
  },

  getDetailComic: async (slug) => {
    const response = await axios.get(`${BASE_URL}/truyen-tranh/${slug}`);
    return response.data;
  },
  getFullComics: async (page = 1) => {
    const response = await axios.get(`${BASE_URL_BE}/comics?page=${page}`);
    return response.data;
  },
  getFullComics1: async (page = 1) => {
    const response = await axios.get(`${BASE_URL}/danh-sach?page=${page}`);
    return response.data;
  },

  searchComic: async (keyword) => {
    const response = await axios.get(`${BASE_URL}/tim-kiem?keyword=${keyword}`);
    return response.data;
  },
  getComicByCate: async (cate) => {
    const response = await axios.get(`${BASE_URL}/the-loai/${cate}`);
    return response.data;
  },
  getComicsByGenre: async (slug, page = 1) => {
    const response = await axios.get(
      `${BASE_URL}/the-loai/${slug}?page=${page}`
    );
    return response.data;
  },
  getComicsByStatus: async (status, page) => {
    const response = await axios.get(
      `${BASE_URL}/danh-sach/${status}?page=${page}`
    );
    return response.data;
  },
};

const categoriesApi = {
  getCate: async () => {
    const response = await axios.get(`${BASE_URL_BE}/categories`);

    return response.data;
  },
};

export { comicsApi, categoriesApi };
