import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.scss";
import { FaUser, FaLock, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../../api/services/loginAPI";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================================
  // Xử lý đăng nhập
  // ================================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await login({
        email: form.email,
        password: form.password,
      });

      // BE trả về result.token
      if (!result?.token) {
        alert("Sai email hoặc mật khẩu!");
        return;
      }

      // Giải mã JWT
      const decoded = jwtDecode(result.token);

      // Scope nằm trong payload: decoded.scope
      const role = decoded.scope; // ADMIN | TUTOR | LEARNER

      console.log("Decoded token:", decoded);
      console.log("Role:", role);

      // Lưu token vào localStorage nếu cần
      if (form.remember) {
        localStorage.setItem("token", result.token);
      }

      // Điều hướng theo role
      switch (role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "TUTOR":
          navigate("/tutor/home");
          break;
        case "LEARNER":
          navigate("/");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Đăng nhập</h1>

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          <div className="input-box password-box">
            <FaLock className="icon" />
            <input
              type={showNew ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              required
            />
            <span className="eye-icon" onClick={() => setShowNew(!showNew)}>
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Ghi nhớ đăng nhập
            </label>
            <Link to="/ForgotPassword">Quên mật khẩu?</Link>
          </div>

          <button type="submit" className="btn-login">
            Đăng nhập
          </button>

          <div className="redirect">
            <p className="text">
              Bạn chưa có tài khoản?
              <Link to="/register/learner" className="link">
                Đăng kí
              </Link>
            </p>
          </div>
        </form>

        <footer>
          © 2025 TutorFinder | Dành cho phụ huynh, học sinh và gia sư{" "}
          <span>TutorFinder</span>
        </footer>
      </div>
    </div>
  );
};

export default Login;
