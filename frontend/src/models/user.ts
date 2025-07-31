import { SavedQuestion } from "./questions";

export type UserToken = {
    accessToken: string;
    refreshToken: string;
};

export type User = {
    username: string;
    email: string;
    savedQuestions: SavedQuestion[];
};
