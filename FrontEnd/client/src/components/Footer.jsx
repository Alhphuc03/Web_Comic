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
          <div className="flex items-center space-x-3">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="h-24 rounded-full"
              />
            </Link>
            <div>
              <h2 className="text-2xl font-bold">P-Comic</h2>
              <p className="text-gray-400 text-sm">
                Kho truyện tranh đa thể loại
              </p>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-4 md:mt-0 ">
            <a
              href="https://www.facebook.com/phuc.le.899326/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 text-xl bg-white text-black font-bold p-3 rounded-full border-2 border-white flex items-center justify-center w-12 h-12"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://github.com/Alhphuc03"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 text-xl bg-white text-black font-bold p-3 rounded-full border-2 border-white flex items-center justify-center w-12 h-12"
            >
              <FaGithub />
            </a>
            <a
              href="mailto:lhphuc03@gmail.com"
              className="hover:text-red-400 text-xl bg-white text-black font-bold p-3 rounded-full border-2 border-white flex items-center justify-center w-12 h-12"
            >
              <FaEnvelope />
            </a>
            <a
              href="#"
              className="hover:text-blue-300 text-xl  bg-white text-black font-bold p-3 rounded-full border-2 border-white flex items-center justify-center w-12 h-12"
            >
              <FaTelegramPlane />
            </a>
            <a
              href="#"
              className="hover:text-gray-400 text-xl  bg-white text-black font-bold p-3 rounded-full border-2 border-white flex items-center justify-center w-12 h-12"
            >
              <FaTiktok />
            </a>
            <a
              href="#"
              className="hover:text-pink-400 text-xl  bg-white text-black font-bold p-3 rounded-full border-2 border-white flex items-center justify-center w-12 h-12"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-lg text-gray-400 mb-6">
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
