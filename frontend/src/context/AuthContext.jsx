import { createContext, useEffect, useState } from "react";

import api from "../api/client.js";

export const AuthContext = createContext(null);

const STORAGE_KEY = "libraryAuth";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  const signup = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", payload);
      setAuth(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", payload);
      setAuth(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider
      value={{
        auth,
        user: auth,
        loading,
        isAuthenticated: Boolean(auth?.token),
        isAdmin: auth?.role === "admin",
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
