import { useEffect, useState } from "react";
import api from "../services/api";
import { setAccessToken } from "../services/api";
import { AuthContext } from "./AuthContext.js";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const refreshResponse = await api.post("/auth/refresh-token");
                setAccessToken(refreshResponse.data.accessToken);

                const meResponse = await api.get("/auth/getMe");
                setUser(meResponse.data.data?.user || null);
            } catch {
                setAccessToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        const token = response.data.data?.accessToken;
        const loggedInUser = response.data.data?.user;
        setAccessToken(token);
        setUser(loggedInUser || null);

        return response.data;
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
