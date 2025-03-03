import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { categoriesApi } from "../api/ComicsApi";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useRouteConfig } from "../../../hooks/useRouteConfig";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userApi } from "../api/UserApi";
// import { FaSun, FaMoon } from "react-icons/fa";
import logo from "../../../assets/logo.webp";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isFixedNavbar } = useRouteConfig();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchKeyword.trim()) {
      navigate(`/search?keyword=${searchKeyword.trim()}`);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Đảo ngược trạng thái menu
  };

  useEffect(() => {
    const fetchCate = async () => {
      try {
        const data = await categoriesApi.getCate();
        setCategories(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCate();
  }, []);

  useEffect(() => {
    if (!isFixedNavbar) return;
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFixedNavbar]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };
  const [profileImage, setProfileImage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      const fetchUserDetails = async () => {
        try {
          const userDetails = await userApi.getUserDetails();
          setProfileImage(userDetails.avatar || "");
        } catch (error) {
          console.error("Error fetching user details:", error);
          setProfileImage("");
        }
      };
      fetchUserDetails();
    }
  }, [token]);
  const handleSearchClick = () => {
    if (searchKeyword.trim() !== "") {
      handleSearch({ key: "Enter" }); // Giả lập sự kiện nhấn Enter
    }
  };
  return (
    <nav
      className={`text-white w-full py-4 top-0 z-50 transition-all duration-300 ease-in-out
      ${isFixedNavbar ? "fixed" : "relative"} 
      ${isScrolled ? "bg-[#111]" : "bg-transparent"}
      ${window.innerWidth < 640 ? "relative" : "fixed"} 
    `}
    >
      <div className="container mx-auto flex justify-between">
        <div className="flex items-center ">
          {/* Logo */}
          <div className="logo ml-2 ">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <img
                src={logo}
                alt="Logo"
                className="h-12 md:h-16 rounded-full"
                width={64}
                height={64}
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex space-x-6">
            <ul className="flex space-x-6 text-2xl font-bold">
              <Link to="/">
                <li className="hover:text-gray-400 cursor-pointer ml-6 p-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-red-600 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">
                  Trang chủ
                </li>
              </Link>
              <Link to="/truyen-tranh">
                <li className="hover:text-gray-400 cursor-pointer p-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-red-600 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">
                  Truyện tranh
                </li>
              </Link>
              <li className="group flex items-center gap-1 relative hover:text-gray-400 cursor-pointer p-2 ">
                Thể loại <FaAngleDown />
                <div className="absolute top-9 bg-gray-800 text-white p-4 mt-2 rounded-lg invisible group-hover:visible">
                  <div className="grid grid-cols-5 gap-2 min-w-max">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        to={`/truyen-tranh/${category.slug}`}
                        className="text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-red-600 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 "
                      >
                        <p className="hover:text-gray-400 cursor-pointer min-w-20 text-left ">
                          {category.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
              <Link to="/gioi-thieu">
                <li className="hover:text-gray-400 cursor-pointer p-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-red-600 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ">
                  Giới thiệu
                </li>
              </Link>
            </ul>
          </div>
        </div>

        <div className="items-center hidden lg:flex space-x-6 mr-2">
          {/* Tìm kiếm */}
          <div className="relative flex items-center" ref={searchRef}>
            <div
              className={`absolute right-0 transform origin-right transition-all duration-500 linear ${
                isSearchOpen
                  ? "scale-x-100 w-96 opacity-100"
                  : "scale-x-0 w-0 opacity-0"
              }`}
            >
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleSearch} // Xử lý sự kiện Enter
                className="p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full"
                autoFocus
              />
            </div>

            {!isSearchOpen && (
              <IoSearch
                className="text-xl cursor-pointer hover:text-gray-400 transition-transform duration-300 linear"
                onClick={() => setIsSearchOpen(true)}
              />
            )}
          </div>

          {/* Nút Đăng ký / Đăng nhập */}
          {isLoggedIn ? (
            <div className="relative group top-0  h-full flex justify-center items-center">
              <img
                src={profileImage}
                alt="User Avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <div className="absolute w-36 top-12 text-xl bg-gray-800 text-white p-4 mt-2 rounded-lg invisible group-hover:visible">
                <Link
                  to="/ho-so"
                  className="block px-3 py-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  Hồ sơ
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-red-500 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex space-x-4 text-2xl font-bold">
              <Button
                className=" text-white relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-red-600 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                to="/login"
              >
                Đăng nhập
              </Button>
              <Button
                className=" text-white relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-red-600 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                to="/register"
              >
                Đăng ký
              </Button>
            </div>
          )}
        </div>

        {/* Responsive Menu Button */}
        <div className="flex lg:hidden mr-2">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-400"
            aria-label="Mở menu"
            title="Mở menu"
          >
            <span className="sr-only">Mở menu</span>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-10 w-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-700 mt-2 rounded-b-lg">
          <ul className="flex flex-col space-y-4 p-4 text-lg">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <li className="hover:text-gray-400 cursor-pointer">Trang chủ</li>
            </Link>
            <Link to="/truyen-tranh" onClick={() => setIsMenuOpen(false)}>
              <li className="hover:text-gray-400 cursor-pointer ">
                Truyện tranh
              </li>
            </Link>
            <li
              className="flex items-center gap-1 cursor-pointer hover:text-gray-400"
              onClick={() => setShowCategories(!showCategories)}
            >
              Thể loại <FaAngleDown />
            </li>
            {showCategories && (
              <div className="w-full bg-gray-800 text-white p-4 mt-2 rounded-lg max-h-60 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/truyen-tranh/${category.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <p className="hover:text-gray-400 cursor-pointer text-left text-xl">
                        {category.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <li className="hover:text-gray-400 cursor-pointer">Giới thiệu</li>
            <li>
              <div
                className="relative flex items-center my-4 w-96"
                ref={searchRef}
              >
                <div
                  className={`absolute left-0 transform origin-right transition-all duration-500 linear flex items-center ${
                    isSearchOpen
                      ? "scale-x-100 w-full opacity-100"
                      : "scale-x-0 w-0 opacity-0"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={handleSearch} // Xử lý Enter
                    className="p-2 rounded-lg text-lg bg-gray-700 text-white placeholder-gray-400 placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-500 linear w-full"
                    autoFocus
                  />
                  <IoSearch
                    className="text-xl text-white cursor-pointer hover:text-gray-400 transition-transform duration-300 ml-2"
                    onClick={handleSearchClick} // Bấm vào icon = nhấn Enter
                  />
                </div>

                {!isSearchOpen && (
                  <IoSearch
                    className="text-xl cursor-pointer hover:text-gray-400 transition-transform duration-300 linear"
                    onClick={() => setIsSearchOpen(true)}
                  />
                )}
              </div>
            </li>

            {isLoggedIn ? (
              <li className="flex space-x-4">
                <Button
                  className="flex-1 bg-red-700 hover:bg-red-600  text-white"
                  to="/ho-so"
                >
                  Hồ sơ
                </Button>
                <Button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white">
                  Đăng ký
                </Button>
              </li>
            ) : (
              <li className="flex space-x-4">
                <Button
                  className="flex-1 bg-red-700 hover:bg-red-600 text-white"
                  to="/login"
                >
                  Đăng nhập
                </Button>
                <Button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white">
                  Đăng ký
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
