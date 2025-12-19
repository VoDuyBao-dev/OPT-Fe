import axiosInstance from "../client/axios";

export const logout = async () => {
  const token = localStorage.getItem("token");

  if (!token) return true;

  try {
    await axiosInstance.post("/auth/logout", {
      token: token, // 👈 QUAN TRỌNG
    });

  } catch (error) {
    console.error(
      "Logout API error:",
      error.response?.data || error.message
    );
  }

  return true;
};
