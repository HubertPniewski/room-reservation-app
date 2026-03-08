import api from "../api.js";

// AuthContext.js
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if an user is logged in after the app start
  useEffect(() => {
    api.get("users/me/")
      .then(res => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // refresh token every 9 minutes (the access token lifetime is 10 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!user) return;
      console.log("refresh");
      refreshToken().catch(err => {
        console.error("Token refresh failed", err);
        setUser(null);
      });
    }, 480000); // 8 min * 60 s * 1000 ms = 480000 ms

    return () => clearInterval(interval);
  }, [user]);

  async function login(email, password) {
    try {
      await api.post("users/auth/login/", { email, password });
      const meRes = await api.get("users/me/");
      const userData = meRes.data;
      setUser(userData);
      return userData;
    } catch (e) {
      let errMessage = "Login failed";
      if (e.response) {
        errMessage = e.response?.data?.detail || JSON.stringify(e.response.data);
      } else {
        errMessage = e.message;
      }
      throw new Error(errMessage);
    }
  }

  async function logout() {
    api.post("users/auth/logout/");
    setUser(null);
  }

  async function register(userData) {
    try {
      const res = await api.post("users/", userData);
      return res.data;
    } catch (e) {
      throw new Error(e.response?.data?.detail || "Registration Failed");
    }
  }

  async function refreshToken() {
    try {
      const res = await api.post("users/auth/token/refresh/");
      return res.data;
    } catch (e) {
      setUser(null);
      throw new Error (e.response?.data?.detail || "Token refresh failed");
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
