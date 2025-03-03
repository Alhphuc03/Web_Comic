const express = require("express");

const {
  saveReadingHistory,
  getLastReadChapter,
} = require("../controller/readingHistoryController/readingHistoryController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Route lưu lịch sử đọc
router.post("/save", auth, saveReadingHistory);

// Route lấy chương đã đọc gần nhất của truyện
router.get("/last-read", auth, getLastReadChapter);

module.exports = router;
