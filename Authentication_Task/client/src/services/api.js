import axios from "axios";

const api = axios.create({
    baseURL: "https://authentication-task-workdir-backend.vercel.app/api",
    withCredentials: true
});

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/refresh-token") &&
            !originalRequest.url?.includes("/auth/login")
        ) {
            originalRequest._retry = true;

            try {
                const response = await api.post("/auth/refresh-token");
                setAccessToken(response.data.accessToken);
                originalRequest.headers.Authorization =
                    `Bearer ${response.data.accessToken}`;
                return api(originalRequest);
            } catch {
                setAccessToken(null);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
