import axios from "axios";
import { getErrorMessage } from "../utils/utils";
import { tokenStorage } from "../utils/tokenStorage";

const apiClient = axios.create({
    //baseURL: "http://127.0.0.1:5000",
    // baseURL: "http://codelingo.us-east-2.elasticbeanstalk.com",
    baseURL: "http://api.codelingo-ai.com",

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
        const originalRequest = error.config;

        //if the error appears from calling POST token/refresh below, we reject the promise to
        //prevent infinite error looping when token/refresh doesn't work and returns an error
        if ((originalRequest.url = "/token/refresh"))
            return Promise.reject(error);

        //check to see if it is a 401 error, which indicates an expired access token
        //and we want to automatically refresh it
        if (error.response?.status === 401) {
            try {
                const refreshToken = tokenStorage.getRefreshToken();
                const refreshResponse = await apiClient.post("/token/refresh", {
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
                return Promise.reject(error);
            }
        }
        console.log(`Request config error. ${getErrorMessage(error)}`);
        return Promise.reject(error);
    }
);

export default apiClient;
