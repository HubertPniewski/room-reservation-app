import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8000/', // use 'https://127.0.0.1:8000/' for production
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 401 handler
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 404) {
      window.location.href = "/404-not-found/";
    }
    return Promise.reject(error);
  }
)

export default api;