import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userApi } from "../../api/UserApi";
import LoginGoogle from "../../components/LoginGoogle";
import Button from "../../components/Button";
import logo from "../../../../assets/logo.webp";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Xóa lỗi khi nhập lại
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Kiểm tra nhập liệu
    let newErrors = {};
    if (!formData.usernameOrEmail) {
      newErrors.usernameOrEmail = "Vui lòng nhập Email hoặc Username!";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu!";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await userApi.Login(formData);
      toast.success(res.msg || "Đăng nhập thành công!");
      localStorage.setItem("token", res.token);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.msg || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-2 relative"
      style={{
        backgroundImage:
          "url('https://images4.alphacoders.com/114/1145075.jpg')",
      }}
    >
      <div className=" absolute top-2 left-2">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 md:h-16 md:w-16 first-line:rounded-full rounded-full"
            width={48}
            height={64}
          />
        </Link>
      </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-[#121212] bg-opacity-90 shadow-lg rounded-xl">
        <h1 className="text-4xl font-bold text-center text-white">Đăng nhập</h1>
        <h2 className="text-base text-center text-[#B0B0B0]">
          Chào mừng bạn đến với website đọc truyện của chúng tôi
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Nhập email hoặc username..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={formData.usernameOrEmail}
              onChange={handleChange}
            />
            {errors.usernameOrEmail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.usernameOrEmail}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>

        <p className="text-right text-red-500 cursor-pointer hover:underline">
          Quên mật khẩu?
        </p>

        <div className="flex items-center space-x-2">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-gray-500 text-sm">Hoặc tiếp tục với</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>
        <LoginGoogle />

        <p className="text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-red-500 hover:underline">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
