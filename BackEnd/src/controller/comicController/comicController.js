const mongoose = require("mongoose"); // Đảm bảo đã import mongoose

const axios = require("axios");
const Comic = require("../../models/ComicModels/comicSchema");
const Chapter = require("../../models/ChapterModels/ChapterSchema");

const API_URL = "https://otruyenapi.com/v1/api/danh-sach?page=";
const TRUYEN_TRANH_API_URL = "https://otruyenapi.com/v1/api/truyen-tranh/";

// Hàm lấy dữ liệu chi tiết truyện tranh và lưu vào MongoDB
const fetchAndSaveComicDetails = async () => {
  let totalPages = 1;

  try {
    // Lấy tổng số trang từ API
    const response = await axios.get(`${API_URL}1`);
    const data = response.data;

    if (data?.data?.params?.pagination?.totalItems) {
      const totalItems = data.data.params.pagination.totalItems;
      const itemsPerPage = data.data.params.pagination.totalItemsPerPage;
      totalPages = Math.ceil(totalItems / itemsPerPage);
    }

    console.log(`Tổng số trang cần quét: ${totalPages}`);

    for (let page = 1; page <= 1; page++) {
      console.log(`📌 Đang lấy dữ liệu từ trang ${page}...`);
      const res = await axios.get(`${API_URL}${page}`);
      const slugs = res.data?.data?.items?.map((comic) => comic.slug) || [];

      const fetchComicDetailsPromises = slugs.map(async (slug) => {
        try {
          const detailRes = await axios.get(`${TRUYEN_TRANH_API_URL}${slug}`);
          const comicDetail = detailRes.data?.data;

          if (comicDetail) {
            // Lưu truyện vào MongoDB
            await Comic.findOneAndUpdate(
              { _id: comicDetail.item._id },
              {
                _id: comicDetail.item._id,
                name: comicDetail.item.name,
                slug: comicDetail.item.slug,
                origin_name: comicDetail.item.origin_name || [],
                descriptionHead: comicDetail.seoOnPage.descriptionHead,
                content: comicDetail.item.content || "",
                status: comicDetail.item.status || "",
                thumb_url: comicDetail.item.thumb_url || "",
                author: comicDetail.item.author || [],
                category: comicDetail.item.category.map((cat) => cat.id) || [],
              },
              { upsert: true, new: true }
            );

            console.log(`✅ Đã cập nhật truyện: ${comicDetail.item.name}`);

            // Lưu chapters vào MongoDB
            await saveChapters(comicDetail.item._id, comicDetail.item.chapters);
          }
        } catch (detailError) {
          console.error(
            `❌ Lỗi khi lấy chi tiết truyện tranh cho slug ${slug}:`,
            detailError
          );
        }
      });

      await Promise.all(fetchComicDetailsPromises);
      console.log(`✅ Hoàn thành trang ${page}`);
    }

    console.log("🎉 Cập nhật danh sách truyện tranh thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu:", error);
  }
};

// 🛠 Hàm lưu danh sách chapters vào MongoDB
const saveChapters = async (comic_id, chapters) => {
  if (!chapters || !Array.isArray(chapters)) {
    console.log(`⚠️ Truyện ${comic_id} không có chương nào.`);
    return;
  }

  try {
    const chapterPromises = [];

    chapters.forEach((chapterGroup) => {
      const server_name = chapterGroup.server_name;

      chapterGroup.server_data.forEach((chapter) => {
        // Sử dụng 'new' khi tạo ObjectId
        const chapterId = new mongoose.Types.ObjectId(); // Đảm bảo sử dụng 'new'

        chapterPromises.push(
          Chapter.findOneAndUpdate(
            { _id: chapterId }, // Đặt _id là ObjectId mới tạo
            {
              _id: chapterId,
              comic_id: comic_id,
              filename: chapter.filename,
              chapter_name: chapter.chapter_name,
              chapter_title: chapter.chapter_title || "", // Nếu không có title, để trống
              chapter_api_data: JSON.stringify({
                url: chapter.chapter_api_data,
              }), // Chúng ta sẽ lưu API data dưới dạng JSON
            },
            { upsert: true, new: true }
          )
        );
      });
    });

    await Promise.all(chapterPromises);
    console.log(`✅ Đã lưu tất cả chapters cho truyện ${comic_id}`);
  } catch (error) {
    console.error(`❌ Lỗi khi lưu chapters cho truyện ${comic_id}:`, error);
  }
};

const getComics = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 28;
    const skip = (page - 1) * limit;

    const totalComics = await Comic.countDocuments();
    const totalPages = Math.ceil(totalComics / limit);

    const comics = await Comic.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      currentPage: page,
      totalPages: totalPages,
      totalComics: totalComics,
      data: comics,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
// Hàm xóa tất cả các danh mục
const deleteAllComics = async (req, res) => {
  try {
    await Comic.deleteMany({}); // Xóa tất cả các document trong collection
    res.json({ status: "success", message: "Đã xóa tất cả comics" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa tất cả danh mục" });
  }
};
module.exports = { fetchAndSaveComicDetails, getComics, deleteAllComics };
