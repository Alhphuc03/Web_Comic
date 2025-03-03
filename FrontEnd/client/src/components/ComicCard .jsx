import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
const ComicCard = ({ comic }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const { offsetWidth: width, offsetHeight: height } = e.currentTarget;
    const { offsetX: x, offsetY: y } = e.nativeEvent;

    const xRotation = (y / height - 0.5) * 20; // Góc xoay theo trục X
    const yRotation = (x / width - 0.5) * -20; // Góc xoay theo trục Y

    setRotateX(xRotation);
    setRotateY(yRotation);
  };

  const resetRotation = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <Link to={`/detail/${comic.slug}`}>
      <div
        className="group rounded-lg max-w-48 shadow-lg hover:shadow-2xl transition-all duration-300 w-46 border-2 border-[#0f0f0f] hover:border-red-900 overflow-hidden relative transform-gpu"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${
            isHovered ? 1.05 : 1
          })`,
          transition: "transform 0.1s ease-out",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setIsHovered(false);
          resetRotation();
        }}
      >
        {/* Hiệu ứng ánh sáng */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-50 transition-all duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${rotateY * 2 + 50}% ${
              rotateX * 2 + 50
            }%, rgba(255, 255, 255, 0.2), transparent)`,
          }}
        ></div>

        {/* Hình ảnh + Cập nhật */}
        <div className="relative">
          <img
            src={`https://otruyenapi.com/uploads/comics/${comic.thumb_url}`}
            alt={comic.name}
            className="w-full h-72 object-cover rounded-lg mb-2 group-hover:scale-105 group-hover:brightness-110 transition-all duration-300 ease-in-out"
            loading="lazy"
          />
          {comic.updatedAt && (
            <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-xs text-gray-300 italic p-1 text-center">
              Cập nhật{" "}
              {formatDistanceToNowStrict(new Date(comic.updatedAt), {
                locale: vi,
              })}{" "}
              trước
            </p>
          )}
        </div>

        {/* Nội dung */}
        <div className="px-1">
          <p className="text-xs text-gray-500">
            Trạng thái:{" "}
            <span
              className={
                comic.status === "ongoing" ? "text-green-500" : "text-red-500"
              }
            >
              {comic.status === "ongoing" ? "Đang tiến hành" : "Hoàn thành"}
            </span>
          </p>

          <h4 className="text-sm font-medium text-gray-300 border rounded-md px-2 max-w-fit my-2">
            {comic.chaptersLatest?.[0]?.chapter_name
              ? `Chapter ${comic.chaptersLatest[0].chapter_name}`
              : "Chưa có chapter"}
          </h4>

          <h3 className="text-xl font-bold text-gray-100 m-0.5 overflow-hidden text-ellipsis whitespace-nowrap w-full group-hover:text-yellow-400  cursor-pointer">
            {comic.name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

// ✅ Xác định kiểu dữ liệu của props
ComicCard.propTypes = {
  comic: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    thumb_url: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    chaptersLatest: PropTypes.arrayOf(
      PropTypes.shape({
        chapter_name: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default ComicCard;
