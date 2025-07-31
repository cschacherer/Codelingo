import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import { getErrorMessage } from "../utils/utils";
import React from "react";
import { tokenStorage } from "../utils/tokenStorage";

type AuthContextType = {
    accessToken: string | null;
    refreshToken: string | null;
    registerUser: (username: string, password: string, email: string) => void;
    loginUser: (username: string, password: string) => void;
    logoutUser: () => void;
    isLoggedIn: () => boolean;
};

type Props = {
    children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        //load any existing tokens when first loading
        tokenStorage.loadFromStorage();
        const storedAccessToken = tokenStorage.getAccessToken();
        const storedRefreshToken = tokenStorage.getRefreshToken();
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);

        //if setTokens or clearTokens is called from anywhere in the application (here or in apiClient.ts),
        //it will update the accessToken and refreshToken in AuthProvider
        tokenStorage.onChange((accessToken, refreshToken) => {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
        });
    }, []);

    const registerUser = async (
        username: string,
        password: string,
        email: string
    ) => {
        try {
            let response = await register(username, password, email);
            tokenStorage.setTokens(response.accessToken, response.refreshToken);
        } catch (error) {
            let msg = getErrorMessage(error);
            console.log(msg);
        }
    };

    const loginUser = async (username: string, password: string) => {
        try {
            let response = await login(username, password);
            tokenStorage.setTokens(response.accessToken, response.refreshToken);
        } catch (error) {
            let msg = getErrorMessage(error);
            console.log(msg);
        }
    };

    const isLoggedIn = () => {
        if (accessToken) {
            return true;
        }
        return false;
    };

    const logoutUser = () => {
        tokenStorage.clearTokens();
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                registerUser,
                loginUser,
                isLoggedIn,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
