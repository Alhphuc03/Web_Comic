import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginGoogle = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL_BASE_BE}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: credentialResponse.credential }), // Gửi token từ Google
        }
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        toast.error("Đăng nhập thất bại!");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Lỗi máy chủ!");
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Đăng nhập thất bại!")}
      />
    </div>
  );
};

export default LoginGoogle;
