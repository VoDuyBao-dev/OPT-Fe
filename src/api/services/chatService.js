import axios from "../client/axios";

/**
 * Danh sách hội thoại của user hiện tại
 * Backend đề xuất: GET /chat/conversations
 */
export const getConversations = async () => {
  const res = await axios.get("/chat/conversations");
  return res.data;
};

/**
 * Lịch sử chat với 1 user (lazy load)
 * Backend đề xuất: GET /chat/history/{userId}?page=0&size=20
 */
export const getChatHistory = async (userId, page = 0, size = 20) => {
  const res = await axios.get(`/chat/history/${userId}`, {
    params: { page, size },
  });
  return res.data;
};


/**
 * Lấy thông tin user đang đăng nhập (phục vụ chat)
 * Backend: GET /chat/me
 */
export const getMe = async () => {
  const res = await axios.get("/chat/me");
  return res.data;
};


export const getStickers = async () => {
  const res = await axios.get("/chat/stickers");
  return res.data;
};