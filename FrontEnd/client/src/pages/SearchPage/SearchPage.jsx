import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { comicsApi } from "../../api/ComicsApi";
import ComicCard from "../../components/ComicCard ";

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Lấy từ khóa tìm kiếm từ URL
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  useEffect(() => {
    if (!keyword) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await comicsApi.searchComic(keyword);
        setResults(response.data.items);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
      setLoading(false);
    };

    fetchSearchResults();
  }, [keyword]);

  return (
    <div className="container mx-auto my-28">
      <h2 className="text-2xl font-bold text-white mb-4">
        Kết quả tìm kiếm cho: {keyword}
      </h2>
      {loading ? (
        <p className="text-white">Đang tải...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {results.map((comic) => (
            <ComicCard key={comic._id} comic={comic} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Không tìm thấy kết quả.</p>
      )}
    </div>
  );
};

export default SearchPage;
