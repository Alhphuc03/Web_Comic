import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoriesApi, comicsApi } from "../../api/ComicsApi";

import {
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useParams } from "react-router-dom";
import ComicCard from "../../components/ComicCard ";

export const ComicPage = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genre, setGenre] = useState("Comedy");
  const [status, setStatus] = useState("truyen-moi");
  const [categories, setCategories] = useState([]);
  const { genreSlug } = useParams();
  const navigate = useNavigate();
  const pageRanges = 5;
  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true);
        const page1 = currentPage * 2 - 1;
        const page2 = currentPage * 2;

        const [response1, response2] = await Promise.all([
          comicsApi.getComicsByStatus(status, page1),
          comicsApi.getComicsByStatus(status, page2),
        ]);

        if (response1.status === "success" && response2.status === "success") {
          setComics([...response1.data.items, ...response2.data.items]);
          const totalItems = response1.data.params.pagination.totalItems;
          const totalItemsPerPage =
            response1.data.params.pagination.totalItemsPerPage;
          setTotalPages(Math.ceil(totalItems / (totalItemsPerPage * 2)));
        } else {
          throw new Error("Không thể lấy dữ liệu");
        }
      } catch (err) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getCate();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchComicsByGenre = async () => {
      try {
        setLoading(true);
        const response = await comicsApi.getComicsByGenre(genreSlug);
        if (response.status === "success" && response.data.items) {
          setComics(response.data.items);
        } else {
          throw new Error("Không thể lấy dữ liệu");
        }
      } catch (err) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    if (genreSlug) {
      fetchComicsByGenre();
      setGenre(genreSlug);
    }

    if (status) {
      fetchComics();
    }
  }, [currentPage, status, genreSlug, genre]);
  const startPage = Math.max(1, currentPage - Math.floor(pageRanges / 2));
  const endPage = Math.min(totalPages, startPage + pageRanges - 1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen md:mt-28 mt-20 mb-6 container px-2 md:mx-auto">
      <div>
        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-4 text-white">
          <label className="text-lg">Tình trạng</label>

          {/* Dropdown trên màn hình nhỏ */}
          <select
            className="block md:hidden p-2 w-2/3 rounded-md bg-gray-800 border border-gray-600 text-md"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="truyen-moi">Truyện mới</option>
            <option value="sap-ra-mat">Sắp ra mắt</option>
            <option value="dang-phat-hanh">Đang phát hành</option>
            <option value="hoan-thanh">Hoàn thành</option>
          </select>

          {/* Danh sách nút trên màn hình lớn */}
          <div className="hidden md:flex gap-2 text-md">
            {[
              { label: "Truyện mới", value: "truyen-moi" },
              { label: "Sắp ra mắt", value: "sap-ra-mat" },
              { label: "Đang phát hành", value: "dang-phat-hanh" },
              { label: "Hoàn thành", value: "hoan-thanh" },
            ].map(({ label, value }) => (
              <button
                key={value}
                className={`px-4 py-2 rounded-md border ${
                  status === value
                    ? "bg-gray-600 border-white"
                    : "border-gray-500"
                }`}
                onClick={() => setStatus(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-4 text-white">
          <label className="text-lg">Thể loại truyện</label>
          <select
            value={genre}
            onChange={(e) => {
              const selectedGenre = e.target.value;
              setGenre(selectedGenre);
              navigate(`/truyen-tranh/${selectedGenre}`); // Điều hướng sang thể loại mới
            }}
            className="p-2 rounded-md bg-gray-800 border border-gray-600 text-md w-2/3 md:w-fit"
          >
            {categories.map((category) => (
              <option key={category._id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">Lỗi: {error}</p>}

      <div className="flex mt-8 justify-between w-full">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
          {loading
            ? Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-gray-700 h-60 rounded-md"
                ></div>
              ))
            : comics.map((comic) => (
                <Link
                  to={`/detail/${comic.slug}`}
                  className="card"
                  key={comic._id}
                >
                  <ComicCard comic={comic} />
                </Link>
              ))}
        </div>
      </div>

      {/* Phân trang */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-red-900 text-white rounded-md disabled:opacity-50"
        >
          <MdKeyboardDoubleArrowLeft />
        </button>

        <button
          onClick={() => handlePageChange((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-red-900 text-white rounded-md disabled:opacity-50"
        >
          <MdKeyboardArrowLeft />
        </button>

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-md ${
              page === currentPage
                ? "bg-red-900 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            handlePageChange((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage >= totalPages}
          className="px-3 py-2 bg-red-900 text-white rounded-md disabled:opacity-50"
        >
          <MdKeyboardArrowRight />
        </button>

        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 bg-red-900 text-white rounded-md disabled:opacity-50"
        >
          <MdKeyboardDoubleArrowRight />
        </button>
      </div>
    </div>
  );
};
