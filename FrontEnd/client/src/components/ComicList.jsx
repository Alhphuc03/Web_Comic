import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { comicsApi } from "../api/ComicsApi";
import ComicCard from "./ComicCard ";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFire,
  FaClock,
  FaCheck,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ComicList = ({ type, title }) => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true);
        const data = await comicsApi.getDanhSachTruyen(type);
        if (data?.data?.items) {
          setComics(data.data.items);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [type]);

  // Định nghĩa icon và màu sắc tương ứng với từng loại truyện
  const styleMap = {
    "Truyện Mới": {
      icon: FaFire,
      color: "text-red-500",
      underline: "bg-red-500",
    },
    "Sắp Ra Mắt": {
      icon: FaClock,
      color: "text-yellow-400",
      underline: "bg-yellow-400",
    },
    "Hoàn Thành": {
      icon: FaCheck,
      color: "text-green-500",
      underline: "bg-green-500",
    },
  };

  const {
    icon: Icon,
    color,
    underline,
  } = styleMap[title] || styleMap["Truyện Mới"]; // Mặc định là Truyện Mới

  // Hàm xử lý scroll ngang
  const scroll = (direction) => {
    if (listRef.current) {
      const listWidth = (listRef.current.offsetWidth || 300) - 130;
      listRef.current.scrollLeft +=
        direction === "left" ? -listWidth : listWidth;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 bg-gray-900 p-4 rounded-lg">
        <p className="font-semibold">Lỗi tải dữ liệu!</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );

  return (
    <div className="relative">
      {/* Tiêu đề danh sách truyện */}
      <motion.div
        className="text-3xl w-fit font-semibold text-white my-4 relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Icon className={color} />
          <h2>{title}</h2>
        </div>
        <div className={`w-full h-1 mt-2 rounded-lg ${underline}`} />
      </motion.div>

      {/* Nút điều hướng trái */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-3 rounded-full shadow-lg z-10 hover:bg-gray-700 transition"
        onClick={() => scroll("left")}
      >
        <FaChevronLeft className="text-white w-6 h-6" />
      </button>

      {/* Hiển thị truyện dưới dạng scroll ngang trên desktop */}
      <motion.div
        ref={listRef}
        className="hidden md:flex overflow-hidden scroll-smooth"
      >
        <div className="flex gap-4 whitespace-nowrap p-2">
          {comics.map((comic) => (
            <motion.div
              key={comic._id}
              className="flex-shrink-0 w-48 my-2"
              whileHover={{ scale: 1.01 }}
            >
              <ComicCard comic={comic} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Hiển thị dạng grid trên mobile */}
      <div className="block md:hidden overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {comics.map((comic) => (
            <motion.div
              key={comic._id}
              className="w-full my-2"
              whileHover={{ scale: 1.01 }}
            >
              <ComicCard comic={comic} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Nút điều hướng phải */}
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-3 rounded-full shadow-lg z-10 hover:bg-gray-700 transition"
        onClick={() => scroll("right")}
      >
        <FaChevronRight className="text-white w-6 h-6" />
      </button>
    </div>
  );
};

ComicList.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ComicList;
