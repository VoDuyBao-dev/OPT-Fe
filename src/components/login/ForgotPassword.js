import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { forgotPassword } from "../../api/services/loginAPI";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendEmail = async () => {
    if (!email.trim()) return alert("Vui lòng nhập email!");

    try {
      const res = await forgotPassword(email);

      alert("Mã OTP đã được gửi đến email!");

      // Lưu email để dùng ở bước OTP
      localStorage.setItem("resetEmail", email);

      // Điều hướng sang trang nhập OTP
      navigate("/OTP");

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Email không tồn tại. Vui lòng thử lại!"
      );
    }
  };


  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Quên mật khẩu</h1>
        <h3>Nhập email đã đăng ký để nhận OTP</h3>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn-login" onClick={handleSendEmail}>
          Gửi OTP
        </button>
        <p className="return" onClick={() => navigate("/login")}>
          ← Quay về đăng nhập
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;