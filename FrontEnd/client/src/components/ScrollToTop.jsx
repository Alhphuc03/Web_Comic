import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Chỉ cuộn lên đầu trang khi URL thay đổi
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]); // Phụ thuộc vào sự thay đổi của `location`

  return null;
}

export default ScrollToTop;
