// 👉 Hàm decode JWT không cần thư viện
export const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
};