// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token") || null);

    const isLoggedIn = !!accessToken;

    const login = (access, refresh) => {
        setAccessToken(access);
        setRefreshToken(refresh);
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
