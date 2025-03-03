import { userApi } from "../../api/UserApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Button";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Kiểm tra các trường có rỗng không
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    // Kiểm tra mật khẩu phải có ít nhất 6 ký tự
    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await userApi.Register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(res.message || "Đăng ký thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-2"
      style={{
        backgroundImage:
          "url('https://images4.alphacoders.com/114/1145075.jpg')",
      }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-[#121212] bg-opacity-90 shadow-lg rounded-xl">
        <h1 className="text-4xl font-bold text-center text-white">Đăng ký</h1>
        <h2 className="text-base text-center text-[#B0B0B0]">
          Chào mừng bạn đến với website đọc truyện của chúng tôi
        </h2>

        {/* {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <input
            type="text"
            name="username"
            placeholder="Nhập tên..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Nhập email..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>

        <div className="flex items-center space-x-2">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-gray-500 text-sm">Hoặc tiếp tục với</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://banner2.cleanpng.com/20180413/rfe/avfci721i.webp"
            alt="Google Login"
            className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
          />
        </div>

        <p className="text-center text-gray-600">
          Bạn đã có tài khoản?{" "}
          <a href="/login" className="text-red-500 hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
