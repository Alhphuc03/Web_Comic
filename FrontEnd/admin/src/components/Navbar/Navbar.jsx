import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Quản lý trạng thái menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Đảo ngược trạng thái menu
  };

  return (
    <nav className="bg-[#111] text-white sticky top-0">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="logo">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq-fzX9A5bgdgM1hqeXXrhsB_dUWfyVY8ZmA&s"
            alt="Logo"
            className="h-16"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <ul className="flex space-x-6 text-xl font-bold">
            <li className="hover:text-gray-400 cursor-pointer ml-6 ">
              Trang chủ
            </li>
            <li className="hover:text-gray-400 cursor-pointer">Thể loại</li>
            <li className="hover:text-gray-400 cursor-pointer">Admin</li>
          </ul>
        </div>

        {/* Tìm kiếm */}
        <div className="w-64 hidden sm:flex items-center flex-1 mx-6">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="flex-1 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Nút Đăng ký / Đăng nhập */}
        <div className="hidden md:flex space-x-4">
          <button className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white">
            Đăng nhập
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white">
            Đăng ký
          </button>
        </div>

        {/* Responsive Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
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
        <div className="md:hidden bg-gray-700">
          <ul className="flex flex-col space-y-4 p-4">
            <li className="hover:text-gray-400 cursor-pointer">Trang chủ</li>
            <li className="hover:text-gray-400 cursor-pointer">Thể loại</li>
            <li className="hover:text-gray-400 cursor-pointer">Giới thiệu</li>
            <li>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full p-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </li>
            <li className="flex space-x-4">
              <button className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white">
                Đăng nhập
              </button>
              <button className="flex-1 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white">
                Đăng ký
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
