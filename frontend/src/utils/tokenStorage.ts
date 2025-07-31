let accessToken: string = "";
let refreshToken: string = "";

const listeners: ((accessToken: string, refreshToken: string) => void)[] = [];

export const tokenStorage = {
    getAccessToken: () => accessToken,
    getRefreshToken: () => refreshToken,

    setTokens: (newAccessToken: string, newRefreshToken: string) => {
        accessToken = newAccessToken;
        refreshToken = newRefreshToken;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        listeners.forEach((callback) => callback(accessToken, refreshToken));
    },

    clearTokens: () => {
        accessToken = "";
        refreshToken = "";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        listeners.forEach((callback) => callback(accessToken, refreshToken));
    },

    loadFromStorage: () => {
        accessToken = localStorage.getItem("accessToken") ?? "";
        refreshToken = localStorage.getItem("refreshToken") ?? "";
    },

    //used to add a function to be called when setTokens or clearTokens is called
    onChange: (callback: (typeof listeners)[number]) => {
        listeners.push(callback);
    },
};
