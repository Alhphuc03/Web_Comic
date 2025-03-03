import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { comicsApi } from "../../api/ComicsApi";

import { ImSortAmountDesc, ImSortAmountAsc } from "react-icons/im";
import { Link } from "react-router-dom";
import { ComicAction, ReadingHistoryApi } from "../../api/UserApi";
import { FaHeartCirclePlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
const Detail = () => {
  const { slug } = useParams();
  const [comicDetail, setComicDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dominantColor, setDominantColor] = useState(null);
  const [activeTab, setActiveTab] = useState("chapters");

  const [sortOrder, setSortOrder] = useState("desc");
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [lastReadChapter, setLastReadChapter] = useState(null);

  useEffect(() => {
    const getDetailComic = async () => {
      try {
        const response = await comicsApi.getDetailComic(slug);
        setComicDetail(response.data);

        if (response.data?.item?.thumb_url) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = `${response.data.APP_DOMAIN_CDN_IMAGE}/uploads/comics/${response.data.item.thumb_url}`;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            const data = ctx.getImageData(0, 0, img.width, img.height).data;
            let r = 0,
              g = 0,
              b = 0;
            for (let i = 0; i < data.length; i += 4) {
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
            }
            const averageColor = `rgb(${Math.round(
              r / (data.length / 4)
            )}, ${Math.round(g / (data.length / 4))}, ${Math.round(
              b / (data.length / 4)
            )})`;

            setDominantColor(averageColor);
            setLoading(false); // Đặt loading sau khi màu được cập nhật
          };

          img.onerror = () => {
            console.error("Error loading image");
            setLoading(false);
          };
        } else {
          console.error("Invalid data structure: item or thumb_url is missing");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching comic details:", error);
        setLoading(false);
      }
    };

    getDetailComic();
  }, [slug]);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        if (!token) return;
        const favorites = await ComicAction.getFavorites(token);
        if (favorites?.some((comic) => comic.comicSlug === slug)) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    checkFavorite();
  }, [slug, token]);

  const handleFavoriteClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để thêm vào yêu thích!");
        navigate("/login");
        return;
      }

      if (isFavorite) {
        // Nếu đã yêu thích -> xóa khỏi danh sách
        await ComicAction.removeFavorite(slug, token);
        setIsFavorite(false);
        toast.success("Đã xóa khỏi danh sách yêu thích! ✨");
      } else {
        // Nếu chưa yêu thích -> thêm vào danh sách
        await ComicAction.addFavorite(
          comicDetail.item._id,
          comicDetail.item.name,
          slug,
          comicDetail.item.thumb_url,
          token
        );

        setIsFavorite(true);
        toast.success("Đã thêm vào danh sách yêu thích!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật danh sách yêu thích:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  useEffect(() => {
    const fetchLastReadChapter = async () => {
      try {
        if (!token || !slug) return; // Kiểm tra token và slug

        // Gọi API để lấy chương đã đọc gần nhất
        const response = await ReadingHistoryApi.getLastReadChapter(
          slug,
          token
        );

        if (response?.chapterName) {
          setLastReadChapter(response.chapterName); // Cập nhật chương đã đọc gần nhất
        }
      } catch (error) {
        console.error("Lỗi khi lấy chương đã đọc:", error);
      }
    };

    fetchLastReadChapter();
  }, [slug, token]); // Chạy lại khi slug hoặc token thay đổi

  if (loading) {
    return <div className="pt-28">Loading...</div>;
  }

  if (!comicDetail) {
    return <div className="pt-28">Comic not found</div>;
  }

  const { item, APP_DOMAIN_CDN_IMAGE } = comicDetail;

  const containerStyle = {
    background: `linear-gradient(to right, ${
      dominantColor || "#888"
    } 0%, #141414 100%)`,
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSortClick = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc")); // Toggle sort order
  };

  // Sort chapters based on sortOrder
  const sortedChapters = item.chapters.map((server) => ({
    ...server,
    server_data: [...server.server_data].sort((a, b) =>
      sortOrder === "desc"
        ? parseFloat(b.chapter_name) - parseFloat(a.chapter_name)
        : parseFloat(a.chapter_name) - parseFloat(b.chapter_name)
    ),
  }));

  const handleContinueRead = () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    if (!lastReadChapter) {
      toast.error("Bạn chưa đọc truyện");
      return;
    }

    // Tìm chương gần nhất
    const selectedChapter = item.chapters
      .flatMap((server) => server.server_data)
      .find((chapter) => chapter.chapter_name === lastReadChapter);

    if (!selectedChapter) {
      toast.error("Không tìm thấy thông tin chương đã đọc.");
      return;
    }

    navigate(`/${slug}/chapter/${selectedChapter.chapter_name}`, {
      state: { currentChapter: selectedChapter, allChapters: item.chapters },
    });
  };

  const handleReadChapter = (type) => {
    if (!item.chapters || item.chapters.length === 0) {
      toast.error("Không có chương nào để đọc.");
      return;
    }

    let selectedChapter = null;
    let chapterNumber = type === "latest" ? -Infinity : Infinity;

    item.chapters.forEach((server) => {
      server.server_data.forEach((chapter) => {
        const num = parseFloat(chapter.chapter_name);
        if (
          (type === "latest" && num > chapterNumber) ||
          (type === "first" && num < chapterNumber)
        ) {
          chapterNumber = num;
          selectedChapter = chapter;
        }
      });
    });

    if (!selectedChapter) {
      toast.error(
        `Không tìm thấy chương ${type === "latest" ? "mới nhất" : "đầu tiên"}.`
      );
      return;
    }
    console.log("chaptera", selectedChapter.chapter_name);
    navigate(`/${item.slug}/chapter/${selectedChapter.chapter_name}`, {
      state: {
        currentChapter: selectedChapter,
        allChapters: item.chapters,
      },
    });
  };

  return (
    <div>
      <div className="pt-28 px-2" style={{ ...containerStyle, opacity: 1 }}>
        <div className="container mx-auto flex flex-col md:flex-row gap-8 md:gap-20">
          {/* Ảnh */}
          <div className="text-center mb-6 md:mb-0">
            <img
              src={`${APP_DOMAIN_CDN_IMAGE}/uploads/comics/${item.thumb_url}`}
              alt={item.name}
              className="w-[200px] sm:w-[250px] md:w-[300px] h-auto mx-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Thông tin */}
          <div className="w-full flex flex-col justify-between">
            <div className="">
              <div className="p-4 w-full rounded-lg bg-gradient-to-r from-black/60 to-transparent">
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold">
                  {item.name}
                </h1>
              </div>

              <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-black/40 to-transparent mt-6 md:mt-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  Tác giả:{" "}
                  <span className="text-lg sm:text-xl text-[#B0B0B0]">
                    {typeof item.author === "string" &&
                    item.author.trim() !== ""
                      ? item.author
                      : "Đang cập nhật"}
                  </span>
                </h2>

                <h2 className="text-xl sm:text-2xl font-semibold text-white mt-2">
                  Thể loại:
                </h2>
                <span className="text-lg sm:text-xl text-[#B0B0B0]">
                  {Array.isArray(item.category) && item.category.length > 0
                    ? item.category.map((category, index) => (
                        <Link
                          key={`${category._id}-${index}`}
                          to={`/truyen-tranh/${category.slug}`}
                          className="hover:opacity-50"
                        >
                          {category.name}
                          {index !== item.category.length - 1 ? ", " : ""}
                        </Link>
                      ))
                    : "Đang cập nhật"}
                </span>

                <h2 className="text-xl sm:text-2xl font-semibold text-white mt-2">
                  Mô tả:
                </h2>
                <span className="text-lg sm:text-xl text-[#B0B0B0]">
                  {typeof comicDetail?.seoOnPage?.descriptionHead ===
                    "string" &&
                  comicDetail.seoOnPage.descriptionHead.trim() !== ""
                    ? comicDetail.seoOnPage.descriptionHead
                    : "Đang cập nhật"}
                </span>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 text-lg mt-2">
              <Button
                className="icon-action p-4 bg-black/50"
                onClick={handleFavoriteClick}
              >
                <FaHeartCirclePlus
                  className="mx-auto hover:cursor-pointer"
                  style={{ color: isFavorite ? "red" : "gray" }}
                />
              </Button>

              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => handleReadChapter("first")}
              >
                Đọc từ đầu
              </Button>

              <Button
                className="w-full bg-green-500 text-white hover:bg-green-600"
                onClick={() => handleReadChapter("latest")}
              >
                Đọc mới nhất
              </Button>

              <Button
                className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
                onClick={handleContinueRead}
              >
                {lastReadChapter
                  ? `Đọc tiếp tục - Chương ${lastReadChapter}`
                  : "Đọc tiếp tục"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container mx-auto flex justify-center gap-10 mt-10"
        style={containerStyle}
      >
        <Button
          className={`relative text-2xl md:text-3xl text-white pb-1 ${
            activeTab === "chapters"
              ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-red-700"
              : ""
          }`}
          onClick={() => handleTabClick("chapters")}
        >
          Chương
        </Button>

        <Button
          className={`relative text-2xl md:text-3xl text-white pb-1 ${
            activeTab === "comments"
              ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-red-700"
              : ""
          }`}
          onClick={() => handleTabClick("comments")}
        >
          Bình luận
        </Button>
      </div>

      {activeTab === "chapters" && (
        <div className="container mx-auto mb-10 px-2">
          <div className="flex justify-between items-center my-4">
            <h2 className="text-xl md:text-3xl font-semibold text-white">
              Danh sách chương:
            </h2>
            <div
              className="flex items-center cursor-pointer"
              onClick={handleSortClick}
            >
              <h2 className="text-xl md:text-3xl font-semibold text-white mr-2 flex items-center gap-1">
                Sắp xếp
                {sortOrder === "desc" ? (
                  <ImSortAmountDesc />
                ) : (
                  <ImSortAmountAsc />
                )}
              </h2>
            </div>
          </div>
          <ul
            className="min-h-[500px] max-h-[1000px] overflow-y-auto"
            style={{ scrollbarColor: "#888 #222" }}
          >
            {sortedChapters.map((server) => (
              <li key={server.server_name} className="text-xl text-white/50">
                <h3 className=" mb-1">{server.server_name}</h3>
                <ul>
                  {server.server_data.map((chapter) => (
                    <li key={chapter.chapter_name} className="text-lg mb-1">
                      <Link
                        to={`/${item.slug}/chapter/${chapter.chapter_name}`}
                        state={{
                          currentChapter: chapter,
                          allChapters: item.chapters,
                        }}
                        className="text-white/90 hover:underline"
                      >
                        Chương {chapter.chapter_name}{" "}
                        {chapter.chapter_title && `- ${chapter.chapter_title}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "comments" && (
        <div className="container mx-auto mb-10 ">
          <h2 className="text-2xl font-semibold mt-6 mb-2">
            Danh sách bình luận:
          </h2>
          <ul className="min-h-[300px] max-h-[500px] overflow-y-auto">
            <li>Bình luận 1</li>
            <li>Bình luận 2</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Detail;
