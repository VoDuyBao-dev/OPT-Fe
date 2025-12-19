import axiosInstance from "../client/axios";
import { decodeToken } from "./decodeToken";

// Login
export const login = async ({ email, password }) => {
  const response = await axiosInstance.post("/auth/login", { email, password });

  const result = response.data?.result;
  if (!result?.token) throw new Error("Không có token");

  const token = result.token;

  // Lưu token
  localStorage.setItem("token", token);

  // Giải mã token để lấy scope
  const decoded = decodeToken(token);

  if (decoded?.scope) {
    // Chuẩn hóa role: ROLE_ADMIN → ADMIN
    const rawRole = decoded.scope;
    const cleanedRole = rawRole.replace("ROLE_", "").toUpperCase();

    localStorage.setItem("role", cleanedRole);
  }

  return result;
};



//forget password 
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(
      "/auth/forgot-password",
      { email: email.trim() },
      { timeout: 15000 }
    );

    return response.data;
  } catch (err) {
    console.error("Forgot password error:", err.response?.data);
    throw err;
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axiosInstance.post(
      "/auth/otp/verifyOtp",
      {
        email: email.trim(),
        otp: otp.trim()
      },
      { timeout: 15000 }
    );

    return response.data;
  } catch (err) {
    console.error("Lỗi verify OTP:", err.response?.data);
    throw err.response?.data || err;
  }
};

// Resend OTP
export const resendOtp = async (email) => {
  try {
    const response = await axiosInstance.post(
      "/auth/otp/resendOtp",
      { email: email.trim() },
      { timeout: 15000 }
    );

    return response.data;
  } catch (err) {
    console.error("Lỗi resend OTP:", err.response?.data);
    throw err.response?.data || err;
  }
};

// reset password
export const resetPassword = async ({ email, password, confirmPassword }) => {
  try {
    const res = await axiosInstance.post("/auth/reset-password", {
      email,
      password,
      confirmPassword,
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};


