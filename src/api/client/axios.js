import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/tutorsFinder';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.defaults.headers.common['Accept'] = 'application/json';

axiosInstance.interceptors.request.use((config) => {

  // 🔥 Đọc đúng key mà login đã lưu
  const token = localStorage.getItem('token');

  if (process.env.NODE_ENV === 'development') {
    console.debug('Auth token present:', !!token);
  }

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response) {
      const { status, data } = error.response;
        if (status === 401) {
          console.warn('API returned 401 - clearing auth and redirecting to login.');
          try {
            ['token', 'role', 'userType', 'user'].forEach((k) => localStorage.removeItem(k));
          } catch (e) { /* ignore */ }

          if (typeof window !== 'undefined') {
            window.location.href = '/Login';
          }
      } else {
        // Log other API errors (400, 422, 500 etc) for easier debugging
        try {
          console.error('API error', status, JSON.stringify(data, null, 2));
        } catch (e) {
          console.error('API error', status, data);
        }
      }
    } else {
      console.error('Network/API error without response object', error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
