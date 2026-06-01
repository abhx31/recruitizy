import { create } from "zustand"
import { persist } from "zustand/middleware";

type UserRole = "recruiter" | "applicant"

interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

interface AuthState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;

    setAuth: (
        accessToken: string,
        user: User
    ) => void;

    logout: () => void;

    setAccessToken: (
        accessToken: string
    ) => void;
}

export const useAuthStore = create<AuthState>() (
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            isAuthenticated: false,
            setAuth: (
                accessToken,
                user
            ) => set({
                accessToken,
                user,
                isAuthenticated: true,
            }),

            setAccessToken: (
                accessToken
            ) => set({
                accessToken,
            }),

            logout: () => set({
                accessToken: null,
                user: null,
                isAuthenticated: false,
            }),
        }),

        {
            name: "auth-storage",
        }
    )
);