import axios from "axios";

const BASE_URL = "https://otruyenapi.com/v1/api";

const comicsApi = {
  getHome: async () => {
    const response = await axios.get(`${BASE_URL}/home`);
    return response.data;
  },
};

export default comicsApi;
