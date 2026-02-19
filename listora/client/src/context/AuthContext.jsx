import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getStoredAuth = () => {
    const localUser = localStorage.getItem("user");
    const localToken = localStorage.getItem("token");

    const sessionUser = sessionStorage.getItem("user");
    const sessionToken = sessionStorage.getItem("token");

    if (localUser && localToken) {
      return {
        user: JSON.parse(localUser),
        token: localToken,
        storage: "local",
      };
    }

    if (sessionUser && sessionToken) {
      return {
        user: JSON.parse(sessionUser),
        token: sessionToken,
        storage: "session",
      };
    }

    return { user: null, token: null, storage: null };
  };

  const stored = getStoredAuth();

  const [user, setUser] = useState(stored.user);
  const [token, setToken] = useState(stored.token);
  const [storageType, setStorageType] = useState(stored.storage);

  // LOGIN (supports Remember Me)
  const login = (data, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("user", JSON.stringify(data.user));
    storage.setItem("token", data.token);

    setUser(data.user);
    setToken(data.token);
    setStorageType(rememberMe ? "local" : "session");
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    setUser(null);
    setToken(null);
    setStorageType(null);
  };

  // Sync auth if storage changes (multi-tab safety)
  useEffect(() => {
    const syncAuth = () => {
      const refreshed = getStoredAuth();
      setUser(refreshed.user);
      setToken(refreshed.token);
      setStorageType(refreshed.storage);
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
