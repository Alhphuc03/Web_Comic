import { useEffect, useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [visibleImages, setVisibleImages] = useState([]);
  const imageRefs = useRef([]);

  useEffect(() => {
    setIsLoading(true);
    if (currentChapter?.chapter_api_data) {
      fetch(currentChapter.chapter_api_data)
        .then((response) => response.json())
        .then((data) => {
          setTimeout(() => {
            setChapterData(data.data.item);
            setIsLoading(false);
          }, 1000);
        })
        .catch((error) => {
          console.error("Error fetching chapter data:", error);
          setIsLoading(false);
        });
    }
  }, [currentChapter]);

  // Lazy loading với Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleImages((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      imageRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [chapterData]);

  // Lưu lịch sử đọc
  useEffect(() => {
    if (chapterData && token) {
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
  }, [chapterData, slug, token]);

  // Nếu đang loading, hiển thị vòng tròn đỏ
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
      </div>
    );
  }

  if (!chapterData) return <div>Loading...</div>;

  const chapterList = allChapters.flatMap((server) => server.server_data);
  const currentIndex = chapterList.findIndex(
    (chap) => chap.chapter_name === currentChapter.chapter_name
  );
  const prevChapter = currentIndex > 0 ? chapterList[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapterList.length - 1
      ? chapterList[currentIndex + 1]
      : null;

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto w-screen mb-28">
      <div className="w-full lg:w-4/5 bg-[#242526] mx-auto rounded-lg p-2 my-4 text-white">
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

        <h1 className="text-2xl md:text-3xl my-2">
          {chapterData.comic_name.split("[")[0]}
        </h1>
        <h2 className="text-xl md:text-2xl mb-1">
          Chương {chapterData.chapter_name}
        </h2>
        <h3 className="text-lg md:text-xl">
          {chapterData.chapter_title || "Không có tiêu đề"}
        </h3>

        <div className="flex gap-4 justify-center items-center text-white">
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

      <div className="my-10">
        {chapterData.chapter_image.map((image, index) => (
          <div
            key={index}
            ref={(el) => (imageRefs.current[index] = el)}
            data-index={index}
            className="min-h-[200px] flex items-center justify-center"
          >
            {visibleImages[index] ? (
              <img
                src={`https://sv1.otruyencdn.com/${chapterData.chapter_path}/${image.image_file}`}
                alt={`Page ${image.image_page}`}
                className="mx-auto w-full md:w-4/5 lg:w-2/5"
                loading="lazy"
              />
            ) : (
              <div className="w-full md:w-4/5 lg:w-2/5 h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 bg-gray-700 p-2 w-full">
        <div className="flex gap-4 justify-center items-center text-white">
          <Link to="/">
            <FaHome className="text-3xl text-white" />
          </Link>
          {prevChapter ? (
            <Link
              to={`/${slug}/chapter/${prevChapter.chapter_name}`}
              state={{ currentChapter: prevChapter, allChapters }}
              onClick={handleScrollTop}
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
          <div className="relative">
            <button
              className="bg-gray-800 w-44 text-white px-6 py-2 rounded flex items-center gap-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span> Chương {currentChapter.chapter_name}</span>{" "}
              <FaChevronDown />
            </button>
            {isOpen && (
              <ul
                className="absolute left-0 bottom-full mb-1 w-44 bg-gray-900 text-white shadow-lg rounded max-h-80 overflow-y-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
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
          {nextChapter ? (
            <Link
              to={`/${slug}/chapter/${nextChapter.chapter_name}`}
              state={{ currentChapter: nextChapter, allChapters }}
              onClick={handleScrollTop}
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
