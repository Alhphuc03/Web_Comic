const ReadingHistory = require("../../models/ReadingHistoryModel/ReadingHistorySchema");

// Lưu hoặc cập nhật lịch sử đọc (Lấy userId từ token)
const saveReadingHistory = async (req, res) => {
  try {
    const { comicSlug, chapterName } = req.body;
    const userId = req.user.id; // Lấy userId từ token

    if (!comicSlug || !chapterName) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin truyện hoặc chương" });
    }

    // Kiểm tra xem user đã có lịch sử đọc truyện này chưa
    let history = await ReadingHistory.findOne({ userId, comicSlug });

    if (history) {
      // Cập nhật chương mới nhất
      history.chapterName = chapterName;
      history.updatedAt = Date.now();
    } else {
      // Tạo mới nếu chưa có lịch sử
      history = new ReadingHistory({ userId, comicSlug, chapterName });
    }

    await history.save();
    return res.status(200).json({ message: "Lưu thành công", data: history });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy chương đã đọc gần nhất của một truyện
const getLastReadChapter = async (req, res) => {
  try {
    const { comicSlug } = req.query; // Sử dụng query string thay vì body để lấy comicSlug
    const userId = req.user.id; // Lấy userId từ token

    if (!comicSlug) {
      return res.status(400).json({ message: "Thiếu thông tin truyện" });
    }

    const history = await ReadingHistory.findOne({ userId, comicSlug });

    if (!history) {
      return res.status(404).json({ message: "Không có dữ liệu lịch sử đọc" });
    }

    // Trả về chapterName của lịch sử đọc gần nhất
    return res.status(200).json({ chapterName: history.chapterName });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { saveReadingHistory, getLastReadChapter };
