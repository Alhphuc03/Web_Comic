import { CiLogout, CiCircleInfo } from "react-icons/ci";
import { MdFavoriteBorder } from "react-icons/md";
import { useEffect, useState } from "react";
import { ComicAction, userApi } from "../../api/UserApi";

import { MdDelete } from "react-icons/md"; // Import icon xóa
import { toast } from "react-toastify";
import ComicCard from "../../components/ComicCard ";

export const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("profile-info");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");
  const [refreshFavorites, setRefreshFavorites] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userApi.getUserDetails(token);
        setUserData(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, selectedTab]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await ComicAction.getFavorites(token);
        const formattedFavorites = response.map((item) => ({
          _id: item.comicId,
          name: item.comicName,
          slug: item.comicSlug,
          thumb_url: item.comicImg,
          status: "ongoing",
          chaptersLatest: [],
        }));
        setFavorites(formattedFavorites);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [token, selectedTab, refreshFavorites]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Đăng xuất thành công!");
    setTimeout(() => {
      window.location.href = "/"; // Chuyển hướng và reload luôn
    }, 500);
  };

  const handleRemoveFavorite = async (slug) => {
    try {
      await ComicAction.removeFavorite(slug, token);
      toast.success("Đã xóa khỏi danh sách yêu thích! ✨");
      setRefreshFavorites((prev) => !prev);
    } catch (error) {
      console.error("Lỗi khi xóa truyện khỏi danh sách yêu thích:", error);
    }
  };
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-gray-400">Đang tải...</p>;
    }

    if (!userData) {
      return <p className="text-red-500">Không thể tải dữ liệu.</p>;
    }
    switch (selectedTab) {
      case "profile-info":
        return (
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Thông tin người dùng
            </h1>
            <div className="flex items-center space-x-6">
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-md"
              />
              <div>
                <p className="text-lg font-semibold text-white">
                  Tên: {userData.username}
                </p>
                <p className="text-gray-400">Email: {userData.email}</p>
              </div>
            </div>
          </div>
        );
      case "favorite-list":
        return (
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Danh sách truyện yêu thích
            </h1>
            {isLoading ? (
              <p className="text-gray-400">Đang tải...</p>
            ) : favorites.length === 0 ? (
              <p className="text-gray-600">Bạn chưa có truyện yêu thích nào.</p>
            ) : (
              <div className="flex justify-start gap-4 flex-wrap">
                {favorites.map((comic) => (
                  <div key={comic._id} className="relative">
                    {/* Hiển thị ComicCard */}
                    <ComicCard comic={comic} />

                    {/* Nút xóa hiển thị bên ngoài ComicCard */}
                    <button
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 p-2 rounded-full"
                      onClick={() => handleRemoveFavorite(comic.slug)}
                    >
                      <MdDelete className="text-white text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "logout":
        return <p className="text-red-500">Đang đăng xuất...</p>;
      default:
        return null;
    }
  };

  return (
    <div className="my-28 h-fit flex bg-[#121212] text-white ">
      <div className="flex flex-col md:flex-row w-full p-6">
        <div className="w-full md:w-1/4 h-fit bg-[#1E1E1E] p-4 shadow-lg rounded-lg">
          <div className="flex flex-col space-y-4">
            <div
              className={`flex items-center space-x-3 p-3 rounded cursor-pointer ${
                selectedTab === "profile-info"
                  ? "bg-[#00ADB5] text-white"
                  : "hover:bg-[#2E2E2E]"
              }`}
              onClick={() => setSelectedTab("profile-info")}
            >
              <CiCircleInfo className="text-xl" />
              <h3 className="text-lg font-semibold">Thông tin người dùng</h3>
            </div>

            <div
              className={`flex items-center space-x-3 p-3 rounded cursor-pointer ${
                selectedTab === "favorite-list"
                  ? "bg-[#00ADB5] text-white"
                  : "hover:bg-[#2E2E2E]"
              }`}
              onClick={() => setSelectedTab("favorite-list")}
            >
              <MdFavoriteBorder className="text-xl" />
              <h3 className="text-lg font-semibold">Danh sách yêu thích</h3>
            </div>

            <div
              className="flex items-center space-x-3 p-3 hover:bg-[#FF4C4C] rounded cursor-pointer text-red-500 hover:text-white"
              onClick={() => setSelectedTab("logout")}
            >
              <CiLogout className="text-xl" />
              <h3 className="text-lg font-semibold" onClick={handleLogout}>
                Đăng xuất
              </h3>
            </div>
          </div>
        </div>

        <div className="w-full h-fit md:w-3/4 bg-[#1E1E1E] p-6 shadow-lg rounded-lg ml-0 md:ml-6 mt-6 md:mt-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
