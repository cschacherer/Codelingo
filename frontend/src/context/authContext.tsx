import { createContext, useContext, useEffect, useState } from "react";
import { login, register } from "../services/authService";
import { getErrorMessage } from "../utils/utils";
import React from "react";
import { tokenStorage } from "../utils/tokenStorage";

type AuthContextType = {
    accessToken: string | null;
    refreshToken: string | null;
    loggedIn: boolean;
    registerUser: (username: string, password: string, email: string) => void;
    loginUser: (username: string, password: string) => void;
    logoutUser: () => void;
};

type Props = {
    children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        //load any existing tokens when first loading
        tokenStorage.loadFromStorage();
        const storedAccessToken = tokenStorage.getAccessToken();
        const storedRefreshToken = tokenStorage.getRefreshToken();
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setLoggedInIfValidAccessToken();

        //if setTokens or clearTokens is called from anywhere in the application (here or in apiClient.ts),
        //it will update the accessToken and refreshToken in AuthProvider
        tokenStorage.onChange((accessToken, refreshToken) => {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setLoggedInIfValidAccessToken();
        });
    }, []);

    const setLoggedInIfValidAccessToken = () => {
        if (tokenStorage.getAccessToken()) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    };

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
            throw new Error(msg);
        }
    };

    const loginUser = async (username: string, password: string) => {
        try {
            let response = await login(username, password);
            tokenStorage.setTokens(response.accessToken, response.refreshToken);
        } catch (error) {
            let msg = getErrorMessage(error);
            throw new Error(msg);
        }
    };

    const logoutUser = () => {
        try {
            tokenStorage.clearTokens();
        } catch (error) {
            let msg = getErrorMessage(error);
            throw new Error(msg);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                loggedIn,
                registerUser,
                loginUser,
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
