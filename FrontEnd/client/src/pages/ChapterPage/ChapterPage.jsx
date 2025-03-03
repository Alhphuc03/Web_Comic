import { useEffect, useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";

import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { FaHome, FaChevronDown } from "react-icons/fa";
import { ReadingHistoryApi } from "../../api/UserApi";
import Button from "../../components/Button";

const ChapterPage = () => {
  const location = useLocation();
  const { slug } = useParams();
  const { currentChapter, allChapters } = location.state || {};

  const [chapterData, setChapterData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (currentChapter?.chapter_api_data) {
      fetch(currentChapter.chapter_api_data)
        .then((response) => response.json())
        .then((data) => {
          setChapterData(data.data.item);
        })
        .catch((error) => {
          console.error("Error fetching chapter data:", error);
        });
    }
  }, [currentChapter]);

  // Lưu lịch sử đọc khi component mount hoặc khi người dùng chuyển sang chương mới
  useEffect(() => {
    if (chapterData) {
      const comicSlug = slug;
      const chapterName = chapterData.chapter_name;
      ReadingHistoryApi.saveReadingHistory(comicSlug, chapterName, token)
        .then((data) => {
          console.log("Lịch sử đọc đã được lưu:", data);
        })
        .catch((error) => {
          console.error("Lỗi khi lưu lịch sử đọc:", error);
        });
    }
  }, [chapterData, slug, token]); // Đảm bảo chỉ gọi khi dữ liệu chapterData được tải xong

  if (!chapterData) return <div>Loading...</div>;

  // Tìm chương trước và chương sau
  const chapterList = allChapters.flatMap((server) => server.server_data);
  const currentIndex = chapterList.findIndex(
    (chap) => chap.chapter_name === currentChapter.chapter_name
  );
  const prevChapter = currentIndex > 0 ? chapterList[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapterList.length - 1
      ? chapterList[currentIndex + 1]
      : null;

  return (
    <div className="container mx-auto w-screen mb-28 px-2">
      <div className=" w-full lg:w-4/5 bg-[#242526] mx-auto rounded-lg p-2 my-4 text-white">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 md:text-lg text-sm flex-wrap">
          <Link to="/" className="text-gray-300 hover:text-white">
            Trang Chủ
          </Link>
          <span>/</span>
          <Link
            to={`/detail/${slug}`}
            className="text-gray-300 hover:text-white"
          >
            {chapterData.comic_name.split("[")[0]}
          </Link>
          <span>/</span>
          <span
            className="text-gray-300 hover:text-white"
            onClick={() => window.location.reload()}
          >
            Chương {chapterData.chapter_name}
          </span>
        </nav>

        {/* Tên Truyện & Chương */}
        <h1 className="text-3xl my-2">
          {chapterData.comic_name.split("[")[0]}
        </h1>
        <h2 className="text-2xl mb-1">Chương {chapterData.chapter_name}</h2>
        <h3 className="text-xl">
          {chapterData.chapter_title || "Không có tiêu đề"}
        </h3>

        {/* Điều hướng chương */}
        <div className="flex gap-4 justify-center items-center text-white">
          {/* Nút Chương Trước */}
          {prevChapter ? (
            <Link
              to={`/${slug}/chapter/${prevChapter.chapter_name}`}
              state={{ currentChapter: prevChapter, allChapters }}
            >
              <Button className="bg-red-900 flex items-center gap-2">
                <GrLinkPrevious />
                <span className="hidden md:block"> Chương trước</span>
              </Button>
            </Link>
          ) : (
            <Button className="bg-gray-500 flex items-center gap-2" disabled>
              <GrLinkPrevious />
              <span className="hidden md:block"> Chương trước</span>
            </Button>
          )}
          {/* Nút Chương Sau */}
          {nextChapter ? (
            <Link
              to={`/${slug}/chapter/${nextChapter.chapter_name}`}
              state={{ currentChapter: nextChapter, allChapters }}
            >
              <Button className="bg-red-900 flex items-center gap-2">
                <span className="hidden md:block"> Chương sau</span>
                <GrLinkNext />
              </Button>
            </Link>
          ) : (
            <Button className="bg-gray-500 flex items-center gap-2" disabled>
              <span className="hidden md:block"> Chương sau</span>
              <GrLinkNext />
            </Button>
          )}
        </div>
      </div>

      {/* Hiển thị hình ảnh chương */}
      <div className="my-10">
        {chapterData.chapter_image.map((image, index) => (
          <img
            key={index}
            src={`https://sv1.otruyencdn.com/${chapterData.chapter_path}/${image.image_file}`}
            alt={`Page ${image.image_page}`}
            className="mx-auto w-full md:w-4/5 lg:w-2/5 "
          />
        ))}
      </div>

      {/* Điều hướng chương */}
      <div className="fixed bottom-0 left-0 bg-gray-700 p-2 w-full">
        <div className="flex gap-4 justify-center items-center  text-white ">
          {/* Nút Home */}
          <Link to="/">
            <FaHome className="text-3xl text-white" />
          </Link>

          {/* Nút Chương Trước */}
          {prevChapter ? (
            <Link
              to={`/${slug}/chapter/${prevChapter.chapter_name}`}
              state={{ currentChapter: prevChapter, allChapters }}
            >
              <Button className="bg-red-900 flex items-center gap-2">
                <GrLinkPrevious />
              </Button>
            </Link>
          ) : (
            <Button className="bg-gray-500 flex items-center gap-2" disabled>
              <GrLinkPrevious />
            </Button>
          )}

          {/* Dropdown chọn chương */}
          <div className="relative">
            <button
              className="bg-gray-800 text-white px-6 py-2 rounded flex items-center gap-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              Chương {currentChapter.chapter_name} <FaChevronDown />
            </button>

            {isOpen && (
              <ul className="absolute left-0 top-full mt-1 w-48 bg-gray-900 text-white shadow-lg rounded max-h-60 overflow-y-auto">
                {chapterList.map((chapter) => (
                  <li key={chapter.chapter_name}>
                    <Link
                      to={`/${slug}/chapter/${chapter.chapter_name}`}
                      state={{ currentChapter: chapter, allChapters }}
                      className="block px-4 py-2 hover:bg-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Chương {chapter.chapter_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Nút Chương Sau */}
          {nextChapter ? (
            <Link
              to={`/${slug}/chapter/${nextChapter.chapter_name}`}
              state={{ currentChapter: nextChapter, allChapters }}
            >
              <Button className="bg-red-900 flex items-center gap-2">
                <GrLinkNext />
              </Button>
            </Link>
          ) : (
            <Button className="bg-gray-500 flex items-center gap-2" disabled>
              <GrLinkNext />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
