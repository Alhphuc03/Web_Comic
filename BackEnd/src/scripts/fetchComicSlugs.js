const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_URL = "https://otruyenapi.com/v1/api/danh-sach?page=";
const TRUYEN_TRANH_API_URL = "https://otruyenapi.com/v1/api/truyen-tranh/";

async function fetchComicDetails() {
  let allComicDetails = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    // Gọi API trang đầu tiên để lấy tổng số trang
    const response = await axios.get(`${API_URL}${currentPage}`);
    const data = response.data;

    if (data && data.data && data.data.params.pagination.totalItems) {
      const totalItems = data.data.params.pagination.totalItems;
      const itemsPerPage = data.data.params.pagination.totalItemsPerPage;
      totalPages = Math.ceil(totalItems / itemsPerPage);
    }

    console.log(`Tổng số trang cần quét: ${totalPages}`);

    // Duyệt qua tất cả các trang
    for (let page = 1; page <= 2; page++) {
      console.log(`Đang lấy dữ liệu từ trang ${page}...`);
      const res = await axios.get(`${API_URL}${page}`);
      const comics = res.data?.data?.items || [];

      // Lấy danh sách slug
      const slugs = comics.map((comic) => comic.slug);

      // Gọi API chi tiết truyện tranh cho từng slug
      for (const slug of slugs) {
        try {
          const detailRes = await axios.get(`${TRUYEN_TRANH_API_URL}${slug}`);
          const comicDetail = detailRes.data?.data;
          if (comicDetail) {
            allComicDetails.push(comicDetail);
          }
        } catch (detailError) {
          console.error(
            `Lỗi khi lấy chi tiết truyện tranh cho slug ${slug}:`,
            detailError
          );
        }
      }
      console.log(`Đã lấy chi tiết truyện tranh từ trang ${page}`);
    }

    // Lưu danh sách chi tiết truyện tranh vào file JSON
    const outputPath = path.join(__dirname, "comicDetails.json");
    fs.writeFileSync(outputPath, JSON.stringify(allComicDetails, null, 2));

    console.log(`Đã lưu danh sách chi tiết truyện tranh vào ${outputPath}`);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  }
}

// Chạy script
fetchComicDetails();
