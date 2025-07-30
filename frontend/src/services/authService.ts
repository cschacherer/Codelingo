import { getErrorMessage } from "../helpers/utils";
import { UserProfileToken } from "../models/user";
import apiClient from "./apiClient";


export const loginAPI = async (username: string, password: string) => {
    try {
        const data = await apiClient.post<UserProfileToken>("/login", {
            username: username, 
            password: password
        }) 
        return data; 
    } catch (error) {
        let msg = getErrorMessage(error); 
        console.log(msg); 
    }
}

export const registerAPI = async (username: string, password: string, email: string) => {
    try {
        const data = await apiClient.post<UserProfileToken>("/register", {
            username: username, 
            password: password, 
            email: email,
        }) 
        return data; 
    } catch (error) {
        let msg = getErrorMessage(error); 
        console.log(msg); 
    }
}