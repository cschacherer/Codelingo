import axios from "axios";
import { getErrorMessage } from "../utils/utils";
import { tokenStorage } from "../utils/tokenStorage";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:5000",
    withCredentials: true,
});

//interceptor to add authorization token to every request
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = tokenStorage.getAccessToken();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        let msg = getErrorMessage(error);
        console.log(`Request config error. ${msg}`);
        return Promise.reject(error);
    }
);

//interceptor to check if the access token has been revoked and if it needs to be refreshed
apiClient.interceptors.response.use(
    (response) => {
        return response; //if there are no errors, just return the response as normal
    },
    async (error) => {
        //check to see if it is a 401 error, which indicates an expired access token
        //and we want to automatically refresh it
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; //mark the request as retried to avoid infinite loops
            try {
                const refreshToken = tokenStorage.getRefreshToken();
                const refreshResponse = await apiClient.post("/refresh", {
                    refreshToken,
                });

                const newAccessToken = refreshResponse.data.access_token;
                tokenStorage.setTokens(newAccessToken, refreshToken);

                apiClient.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;

                //retry sending original request with the updated access token
                return apiClient(originalRequest);
            } catch (refreshError) {
                //refresh token is expired and the user needs to log in again
                console.log(
                    `Token refresh failed. ${getErrorMessage(refreshError)}`
                );
                tokenStorage.clearTokens();
                return Promise.reject(refreshError);
            }
        }
        console.log(`Request config error. ${getErrorMessage(error)}`);
        return Promise.reject(error);
    }
);

export default apiClient;
