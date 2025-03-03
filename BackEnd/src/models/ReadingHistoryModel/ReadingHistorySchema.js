const mongoose = require("mongoose");

const readingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Liên kết đến User
    comicSlug: { type: String, required: true }, // Thay thế comicId bằng comicSlug, kiểu String
    chapterName: { type: String, required: true }, // Tên chương truyện
    updatedAt: { type: Date, default: Date.now }, // Lưu ngày cập nhật
  },
  { collection: "Readinghistories" }
); // Đặt tên collection là Readinghistories

const ReadingHistory = mongoose.model("ReadingHistory", readingHistorySchema);

module.exports = ReadingHistory;
