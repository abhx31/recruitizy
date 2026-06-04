import axios from "axios";

import { useAuthStore } from "@/stores/auth.store";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    }
);

const AUTH_ENDPOINTS = ["/auth/login", "/auth/signup", "/auth/refresh"];

function isAuthEndpoint(url: string | undefined): boolean {
    if (!url) return false;
    return AUTH_ENDPOINTS.some((path) => url.includes(path));
}

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint(originalRequest.url)
        ) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.access_token;

                useAuthStore.getState().setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch {
                useAuthStore.getState().logout();
                // .replace so /login doesn't get added to history every
                // time a session expires.
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);

export default api;
