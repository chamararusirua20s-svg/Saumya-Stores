import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const local = localStorage.getItem("userInfo");
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem("userInfo");
    if (session) return JSON.parse(session);
    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      setUser(data);
      if (rememberMe) {
        localStorage.setItem("userInfo", JSON.stringify(data));
      } else {
        sessionStorage.setItem("userInfo", JSON.stringify(data));
      }
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        phone
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const updateUserData = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      if (localStorage.getItem("userInfo")) {
        localStorage.setItem("userInfo", JSON.stringify(updated));
      }
      if (sessionStorage.getItem("userInfo")) {
        sessionStorage.setItem("userInfo", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
