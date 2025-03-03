import {
  FaFacebookF,
  FaGithub,
  FaEnvelope,
  FaTelegramPlane,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.webp";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-auto">
      <div className="container mx-auto px-6 text-center md:text-left">
        {/* Logo & Slogan */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-12 md:h-16 rounded-full"
                width={64}
                height={64}
              />
            </Link>
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold">P-Comic</h2>
              <p className="text-gray-400 text-sm">
                Kho truyện tranh đa thể loại
              </p>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4 md:mt-0">
            {[
              {
                href: "https://www.facebook.com/phuc.le.899326/",
                icon: <FaFacebookF />,
                hover: "hover:text-blue-400",
                label: "Facebook",
              },
              {
                href: "https://github.com/Alhphuc03",
                icon: <FaGithub />,
                hover: "hover:text-blue-400",
                label: "GitHub",
              },
              {
                href: "mailto:lhphuc03@gmail.com",
                icon: <FaEnvelope />,
                hover: "hover:text-red-400",
                label: "Email",
              },
              {
                href: "#",
                icon: <FaTelegramPlane />,
                hover: "hover:text-blue-300",
                label: "Telegram",
              },
              {
                href: "#",
                icon: <FaTiktok />,
                hover: "hover:text-gray-400",
                label: "TikTok",
              },
              {
                href: "#",
                icon: <FaInstagram />,
                hover: "hover:text-pink-400",
                label: "Instagram",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.hover} text-lg md:text-xl bg-white text-black font-bold p-2 md:p-3 rounded-full border-2 border-white flex items-center justify-center w-10 h-10 md:w-12 md:h-12`}
                aria-label={social.label} // ✅ Giúp trình đọc màn hình hiểu
                title={social.label} // ✅ Hiển thị tooltip khi hover
              >
                <span className="sr-only">{social.label}</span>{" "}
                {/* ✅ Văn bản ẩn cho screen reader */}
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden grid grid-cols-2 md:flex md:flex-wrap justify-center md:justify-start gap-4 text-lg text-gray-400 mb-6">
          <a href="/gioi-thieu" className="hover:text-white">
            Giới thiệu
          </a>
          <a href="#" className="hover:text-white">
            Chính sách bảo mật
          </a>
          <a href="#" className="hover:text-white">
            Điều khoản sử dụng
          </a>
          <a href="#" className="hover:text-white">
            Liên hệ
          </a>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm text-center md:text-left leading-relaxed">
          <strong>P-Comic</strong> - Trang đọc truyện tranh miễn phí với chất
          lượng cao. Kho truyện khổng lồ với nhiều thể loại hấp dẫn: Manhwa,
          Manhua, Manga, và hơn thế nữa. Cập nhật nhanh chóng, trải nghiệm mượt
          mà, không quảng cáo gây phiền!
        </p>

        {/* Copyright */}
        <p className="text-gray-500 text-xs text-center mt-6">
          &copy; 2025 P-Comic. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
