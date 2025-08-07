import { getErrorMessage } from "../utils/utils";
import { UserToken } from "../models/UserToken";
import apiClient from "./apiClient";

export const login = async (username: string, password: string) => {
    try {
        const response = await apiClient.post<UserToken>("/login", {
            username: username,
            password: password,
        });
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};

export const register = async (
    username: string,
    password: string,
    email: string
) => {
    try {
        const response = await apiClient.post<UserToken>("/register", {
            username: username,
            password: password,
            email: email,
        });
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await apiClient.post("/password/reset/request", {
            email: email,
        });
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await apiClient.post("/password/reset", {
            token: token,
            newPassword: newPassword,
        });
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};
