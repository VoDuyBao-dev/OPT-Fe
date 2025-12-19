import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.scss";
import { resetPassword } from "../../api/services/loginAPI";

const NewPassword = () => {
  const navigate = useNavigate();

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const email = localStorage.getItem("otpEmail"); // email đang reset

  const handleResetPassword = async () => {
    if (!email) return alert("Không tìm thấy email cần đặt lại mật khẩu!");

    if (!newPass || !confirmPass)
      return alert("Vui lòng nhập đầy đủ mật khẩu!");

    if (newPass !== confirmPass)
      return alert("Mật khẩu xác nhận không trùng khớp!");

    try {
      const res = await resetPassword({
        email,
        password: newPass,
        confirmPassword: confirmPass,
      });

      alert("Đổi mật khẩu thành công!");
      localStorage.removeItem("otpEmail"); // dọn sạch
      navigate("/login");

    } catch (err) {
      console.log("DEBUG ERROR:", err.response?.data);
      console.log("STATUS:", err.response?.status);
      throw err;
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Đặt mật khẩu mới</h1>

        {/* Mật khẩu mới */}
        <div className="input-box password-box">
          <input
            type={showNew ? "text" : "password"}
            placeholder="Mật khẩu mới"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setShowNew(!showNew)}>
            {showNew ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="input-box password-box">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="btn-login" onClick={handleResetPassword}>
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
