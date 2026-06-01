import { LoginFormValues, SignupFormValues } from "@/schemas/auth.schema";
import axios from "axios";
import api from "@/lib/api";

export async function loginUser(
    data: LoginFormValues
) {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        data
    );

    return response.data;
}

export async function signupUser(
    data: SignupFormValues
) {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        data
    );

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