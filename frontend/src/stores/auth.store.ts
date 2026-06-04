import { create } from "zustand"
import { persist } from "zustand/middleware";

type UserRole = "recruiter" | "applicant"

export type VerificationStatus = "PENDING_EMAIL" | "VERIFIED"

interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    verification_status: VerificationStatus;
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

    setUser: (
        user: User
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

            setUser: (
                user
            ) => set({
                user,
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