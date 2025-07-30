import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../models/user";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../services/authService";
import { getErrorMessage } from "../helpers/utils";
import React from "react";
import axios from "axios";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    registerUser: (username: string, password: string, email: string) => void;
    loginUser: (username: string, password: string) => void;
    logoutUser: () => void;
    isLoggedIn: () => boolean;
};

type Props = {
    children: React.ReactNode;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();

    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const localStorageUser = localStorage.getItem("user");
        const localStorageToken = localStorage.getItem("token");
        if (localStorageUser && localStorageToken) {
            setUser(JSON.parse(localStorageUser));
            setToken(JSON.parse(localStorageToken));
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        setIsReady(true);
    }, []);

    const registerUser = async (
        username: string,
        password: string,
        email: string
    ) => {
        try {
            let response = await registerAPI(username, password, email);
            if (response) {
                localStorage.setItem("token", response?.data?.token);
                const userObj = {
                    username: response.data.username,
                    email: response.data.email,
                };
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(response.data.token);
                setUser(userObj);
                navigate("/search");
            }
        } catch (error) {
            let msg = getErrorMessage(error);
            console.log(msg);
        }
    };

    const loginUser = async (username: string, password: string) => {
        try {
            let response = await loginAPI(username, password);
            if (response) {
                localStorage.setItem("token", response?.data?.token);
                const userObj = {
                    username: response.data.username,
                    email: response.data.email,
                };
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(response.data.token);
                setUser(userObj);
                navigate("/search");
            }
        } catch (error) {
            let msg = getErrorMessage(error);
            console.log(msg);
        }
    };

    const isLoggedIn = () => {
        if (user) {
            return true;
        }
        return false;
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken("");
        navigate("/");
    };

    return (
        <UserContext.Provider
            value={{
                user,
                token,
                registerUser,
                loginUser,
                isLoggedIn,
                logoutUser,
            }}
        >
            {isReady ? children : null}
        </UserContext.Provider>
    );
};

export const useAuth = () => React.useContext(UserContext);
