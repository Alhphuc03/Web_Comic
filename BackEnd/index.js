// require("dotenv").config();
// const express = require("express");
// const cors = require("cors"); // Import cors
// const connectDB = require("./src/config/db");
// const Routes = require("./src/routers/index");
// const cron = require("node-cron");

// const app = express();

// // Kết nối đến cơ sở dữ liệu
// connectDB();

// // Sử dụng middleware CORS
// // app.use(
// //   cors({
// //     origin: [
// //       "http://localhost:5174", // Local frontend
// //       //   "https://cine-plexus-oc1r.vercel.app",
// //     ], // Production frontend // Địa chỉ frontend của bạn
// //     methods: ["GET", "POST", "DELETE"], // Các phương thức mà bạn muốn cho phép
// //     credentials: true,
// //   })
// // );
// app.use(
//   cors({
//     origin: "*", // Cho phép tất cả các nguồn gốc
//     methods: ["GET", "POST", "DELETE"], // Các phương thức mà bạn muốn cho phép
//     credentials: true, // Có thể cần nếu bạn sử dụng cookies hoặc xác thực
//   })
// );

// app.use(express.json());

// // Routes
// app.use("/api", Routes);

// // Chạy cron job 6 tiếng một lần để cập nhật danh mục
// cron.schedule("0 */6 * * *", async () => {
//   console.log("Đang cập nhật danh mục từ API...");
//   await fetchAndSaveCategories();
// });

// // Khởi động server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import cors
const connectDB = require("./src/config/db");
const Routes = require("./src/routers/index");
const cron = require("node-cron");
const authRoutes = require("./src/routers/authRoutes");
const historyRoutes = require("./src/routers/historyRoutes");
const app = express();

// Kết nối đến cơ sở dữ liệu
connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true, // Bật credentials để hỗ trợ cookies hoặc headers đặc biệt
  })
);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.json());

// Routes
app.use("/api", Routes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

// Chạy cron job 6 tiếng một lần để cập nhật danh mục
cron.schedule("0 */6 * * *", async () => {
  console.log("Đang cập nhật danh mục từ API...");
  await fetchAndSaveCategories();
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
