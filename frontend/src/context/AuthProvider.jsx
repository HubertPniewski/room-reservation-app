// AuthContext.js
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if an user is logged in after the app start
  useEffect(() => {
    fetch("https://127.0.0.1:8000/users/me/", {
      method: "GET",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // refresh token every 9 minutes (the access token lifetime is 10 minutes)
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      refreshToken().catch(err => console.error("Token refresh failed", err));
    }, 540000); // 9 min * 60 s * 1000 ms = 540000 ms

    return () => clearInterval(interval);
  }, [user]);

  async function login(email, password) {
    const res = await fetch("https://127.0.0.1:8000/users/auth/login/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      let errMessage = "Login failed";

      try {
        const errData = await res.json();

        if (errData.detail) {
          errMessage = errData.detail;
        } else {
          errMessage = JSON.stringify(errData);
        }
      } catch (err) {
        errMessage = err.message;
      }
      throw new Error(errMessage);
    }

    // get user after login
    const meRes = await fetch("https://127.0.0.1:8000/users/me/", {
      method: "GET",
      credentials: "include",
    });

    if (!meRes.ok) throw new Error("Failed to fetch user");

    const userData = await meRes.json();
    setUser(userData);
    return userData;
  }

  async function logout() {
    await fetch("https://127.0.0.1:8000/users/auth/logout/", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  async function register(userData) {
    const res = await fetch("https://127.0.0.1:8000/users/", {
      method: "POST",
      body: userData,
      credentials: "include",
    });
     
    if (!res.ok) {   
      let errMessage = "Registration failed";
      try {
        const errData = await res.json();

        if (errData.detail) {
          errMessage = errData.detail;
          
        } else {
          errMessage = JSON.stringify(errData);
          console.log(errMessage);
        }
      } catch (err) {
        errMessage = err.message;
      }
      throw new Error(errMessage);
    }

    alert("Registration succeeded!");
    return res.json();
  }

  async function refreshToken() {
    const res = await fetch("https://127.0.0.1:8000/users/auth/token/refresh/", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const data = await res.json();
    return data.access;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
