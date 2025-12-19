import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../api/services/loginAPI";
import "./Login.scss";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [timeLeft, setTimeLeft] = useState(60);

  // Countdown — luôn luôn được phép chạy
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    if (!email) return alert("Không có email!");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      return alert("Vui lòng nhập đủ 6 số OTP!");
    }

    try {
      await verifyOtp(email, otpCode);
      alert("Xác thực OTP thành công!");

      navigate("/NewPassword", { state: { email } });
    } catch (err) {
      alert(err.message || "OTP không đúng!");
    }
  };

  const handleResend = async () => {
    if (!email) return alert("Không có email!");

    try {
      await resendOtp(email);
      alert("OTP mới đã gửi!");

      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(60);
      inputsRef.current[0].focus();
    } catch (err) {
      alert(err.message || "Không thể gửi lại OTP!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Nếu không có email -> thông báo nhưng HOOK vẫn hợp lệ */}
        {!email ? (
          <h3>Không có email! Hãy quay lại trang Quên mật khẩu.</h3>
        ) : (
          <>
            <h1>Nhập mã OTP</h1>
            <p>Email: <b>{email}</b></p>

            <div className="otp-box">
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={val}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  ref={(el) => (inputsRef.current[idx] = el)}
                />
              ))}
            </div>

            <div className="timer">
              {timeLeft > 0 ? (
                <span>Thời gian còn lại: {timeLeft}s</span>
              ) : (
                <button className="btn-resend" onClick={handleResend}>
                  Gửi lại OTP
                </button>
              )}
            </div>

            <button className="btn-login" onClick={handleVerifyOTP}>
              Xác thực OTP
            </button>

            <button
              className="btn-other"
              onClick={handleResend}
              disabled={timeLeft > 0}
            >
              Gửi lại OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OTP;
