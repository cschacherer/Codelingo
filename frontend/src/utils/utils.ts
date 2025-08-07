import axios from "axios";

export const getErrorMessage = (e: unknown): string => {
    if (axios.isAxiosError(e)) {
        let axiosMsg = e.message;
        let responseMsg = e?.response?.data?.message ?? "";
        return `${axiosMsg}. ${responseMsg}`;
    } else if (e instanceof Error) {
        return e.message;
    } else if (e && typeof e === "object" && "message" in e) {
        return String(e.message);
    } else if (e && typeof e === "object" && "toString" in e) {
        return String(e.toString());
    } else if (e && typeof e === "string") {
        return e;
    } else {
        return "Unknown error";
    }
};

export const validateUsername = (username: string): boolean => {
    return true;
};

export const validatePassword = (password: string): boolean => {
    return true;
};

export const validateEmailAddress = (email: string): boolean => {
    const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    return regex.test(email);
};
