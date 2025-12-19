import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/tutorsFinder';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.defaults.headers.common['Accept'] = 'application/json';

axiosInstance.interceptors.request.use((config) => {

  // 🔥 Đọc đúng key mà login đã lưu
  const token = localStorage.getItem('token');

  const isAuthEndpoint = config.url?.startsWith('/auth/');

  if (token && !isAuthEndpoint) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data && (config.data instanceof FormData)) {
    if (config.headers) delete config.headers['Content-Type'];
  } else {
    config.headers = config.headers || {};
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

export default axiosInstance;
