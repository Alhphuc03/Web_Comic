const About = () => {
  return (
    <div className="mt-28 max-w-4xl mx-auto p-8 shadow-xl rounded-lg transition-all duration-300 hover:shadow-2xl">
      {/* Tiêu đề */}
      <h1 className="text-4xl font-extrabold text-center text-white mb-6">
        Giới thiệu về chúng tôi
      </h1>

      {/* Mô tả */}
      <p className="text-gray-200 text-lg leading-relaxed text-center">
        Chào mừng bạn đến với{" "}
        <span className="font-semibold text-blue-500">P-Comic</span> – nền tảng
        đọc truyện tranh trực tuyến **tốt nhất** dành cho bạn! Chúng tôi mang
        đến trải nghiệm đọc mượt mà, tốc độ cao, với hàng ngàn bộ truyện hấp dẫn
        thuộc nhiều thể loại khác nhau.
      </p>

      {/* Danh sách tính năng */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center bg-blue-100 p-4 rounded-lg shadow-sm hover:bg-blue-200 transition">
          <span className="text-2xl">📚</span>
          <p className="ml-3 text-gray-700 text-lg font-medium">
            Kho truyện phong phú, cập nhật liên tục.
          </p>
        </div>

        <div className="flex items-center bg-green-100 p-4 rounded-lg shadow-sm hover:bg-green-200 transition">
          <span className="text-2xl">⚡</span>
          <p className="ml-3 text-gray-700 text-lg font-medium">
            Tốc độ tải nhanh, giao diện thân thiện.
          </p>
        </div>

        <div className="flex items-center bg-yellow-100 p-4 rounded-lg shadow-sm hover:bg-yellow-200 transition">
          <span className="text-2xl">🌙</span>
          <p className="ml-3 text-gray-700 text-lg font-medium">
            Hỗ trợ chế độ đọc ban đêm giúp bảo vệ mắt.
          </p>
        </div>

        <div className="flex items-center bg-purple-100 p-4 rounded-lg shadow-sm hover:bg-purple-200 transition">
          <span className="text-2xl">🔍</span>
          <p className="ml-3 text-gray-700 text-lg font-medium">
            Tìm kiếm nhanh, lưu lịch sử đọc tự động.
          </p>
        </div>
      </div>

      {/* Cảm ơn */}
      <p className="mt-8 text-center text-gray-100 text-lg font-semibold">
        Cảm ơn bạn đã đồng hành cùng{" "}
        <span className="text-blue-500">P-Comic</span>! 📖✨
      </p>
    </div>
  );
};

export default About;
