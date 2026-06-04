import { LoginFormValues, SignupFormValues } from "@/schemas/auth.schema";
import api from "@/lib/api";

export async function loginUser(
    data: LoginFormValues
) {
    // Must use the configured `api` instance (withCredentials: true)
    // so the browser stores the refresh_token httpOnly cookie that the
    // backend sets in Set-Cookie. Raw `axios.post` here would silently
    // drop the cookie and break the auto-refresh flow.
    const response = await api.post("/auth/login", data);

    return response.data;
}

export async function signupUser(
    data: SignupFormValues
) {
    // Same reasoning as loginUser — needs withCredentials for the
    // refresh_token cookie to actually persist.
    const response = await api.post("/auth/signup", data);

    return response.data;
}

export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
}

export async function changePassword(payload: ChangePasswordPayload) {
    const response = await api.post<{ message: string }>(
        "/auth/change-password",
        payload
    );

    return response.data;
}

export async function logoutUser() {
    const response = await api.post<{ message: string }>("/auth/logout");

    return response.data;
}

export interface MeResponse {
    id: string;
    email: string;
    name: string;
    role: "applicant" | "recruiter";
    verification_status: "PENDING_EMAIL" | "VERIFIED";
}

export async function getMe() {
    const response = await api.get<MeResponse>("/auth/me");

    return response.data;
}

export async function verifyEmail(token: string) {
    const response = await api.get<{ message: string }>(
        "/auth/verify-email",
        { params: { token } }
    );

    return response.data;
}

export async function resendVerificationEmail() {
    const response = await api.post<{ message: string }>(
        "/auth/resend-verification"
    );

    return response.data;
}