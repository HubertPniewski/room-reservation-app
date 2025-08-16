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

  async function login(email, password) {
    const res = await fetch("https://127.0.0.1:8000/users/auth/login/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

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
      const err = await res.json();
      throw new Error(err.detail || "Registration failed");
    }

    alert("Registration succeeded!");
    return res.json();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
