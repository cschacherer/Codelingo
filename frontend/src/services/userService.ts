import { getErrorMessage } from "../utils/utils";
import { User } from "../models/User";
import apiClient from "./apiClient";

export const getUser = async () => {
    try {
        const response = await apiClient.get<User>("/user");
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};

export const patchUser = async (
    username: string,
    password: string,
    email: string
) => {
    try {
        const updatedData = {
            username: username,
            password: password,
            email: email,
        };
        const response = await apiClient.patch<User>("/user", updatedData);
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};

export const deleteUser = async () => {
    try {
        const response = await apiClient.delete<User[]>("/user");
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};

export const getAllUsers = async () => {
    try {
        const response = await apiClient.get<User[]>("/users");
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};
