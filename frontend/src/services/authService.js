import api from '../api.js';

export async function login(email, password) {
  try {
    const res = await api.post("users/auth/login/", { email, password });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.detail || "Login failed");
  }
}


export async function logout() {
  try {
    const res = await api.post("users/auth/logout/");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.detail || "Logout failed");
  }
}
