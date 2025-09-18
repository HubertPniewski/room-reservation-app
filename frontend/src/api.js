import axios from "axios";

const api = axios.create({
  baseURL: 'https://127.0.0.1:8000/',
  withCredentials: true,
});

// 401 handler
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      alert('Your session has expired. Please login again.');
      window.location.href = "/login/";
    } else if (error.response && error.response.status === 404) {
      window.location.href = "/404-not-found/";
    }
    return Promise.reject(error);
  }
)

export default api;