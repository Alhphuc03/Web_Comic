import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-cards";
import { comicsApi } from "../api/ComicsApi";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await comicsApi.getHome();
        if (response?.data?.items) {
          const images = response.data.items.map((item, index) => ({
            id: index,
            src: `https://otruyenapi.com/uploads/comics/${item.thumb_url}`,
            title: item.name,
            slug: item.slug,
            description: item.description || "Truyện hấp dẫn đang chờ bạn!",
          }));
          setBanners(images);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleSlideChange = (swiper) => {
    setCurrentIndex(swiper.realIndex);
  };

  const handleNavigate = () => {
    if (banners[currentIndex]) {
      navigate(`/detail/${banners[currentIndex].slug}`);
    }
  };

  return (
    <div className="w-full relative">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
        </div>
      ) : (
        <>
          {/* Desktop Layout */}
          <motion.div
            className="hidden md:flex justify-between items-center p-8 rounded-lg shadow-lg relative overflow-hidden"
            style={{
              backgroundImage: `url(${banners[currentIndex]?.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm bg-gradient-to-r from-transparent to-black"></div>

            {/* Left Content */}
            <div className="w-2/3 relative z-10 pr-6 flex flex-col items-center text-center">
              <div className="text-sm uppercase tracking-wide text-gray-400 mb-2">
                Truyện tranh | Tiểu thuyết | Manga
              </div>
              <motion.h1
                className="text-4xl font-bold mb-4 text-white"
                key={banners[currentIndex]?.title}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {banners[currentIndex]?.title || "Loading..."}
              </motion.h1>
              <p className="text-gray-300 mb-6 text-lg">
                {banners[currentIndex]?.description}
              </p>
              <button
                onClick={handleNavigate}
                className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition transform hover:scale-105"
              >
                Đọc Ngay
              </button>
            </div>

            {/* Right Image Slider */}
            <div className="w-1/3 relative z-10">
              <Swiper
                modules={[Autoplay, EffectCards]}
                effect="cards"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                onSlideChange={handleSlideChange}
                className="w-full max-w-xs"
                loop={false}
              >
                {banners.map((banner) => (
                  <SwiperSlide key={banner.id}>
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={banner.src}
                        alt={banner.title}
                        width="256" // Thay đổi tùy kích thước ảnh
                        height="450"
                        className="w-64 h-[450px] object-cover rounded-lg"
                        loading="lazy"
                      />
                      <div className="absolute w-60 bottom-4 left-2 right-2 bg-black bg-opacity-70 px-4 py-2 rounded text-lg font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap">
                        {banner.title}
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>

          {/* Mobile Layout */}
          <div className="block md:hidden relative p-4 text-center">
            <div
              className="w-full h-80 rounded-lg shadow-lg relative overflow-hidden"
              style={{
                backgroundImage: `url(${banners[currentIndex]?.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
            <h1 className="text-2xl font-bold mt-4 text-white">
              {banners[currentIndex]?.title || "Loading..."}
            </h1>
            <p className="text-gray-300 mt-2 text-base">
              {banners[currentIndex]?.description}
            </p>
            <button
              onClick={handleNavigate}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-lg font-semibold transition transform hover:scale-105"
            >
              Đọc Ngay
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BannerList;
