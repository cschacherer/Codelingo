import { SavedQuestion } from "./SavedQuestion";

export type User = {
    username: string;
    email: string;
    savedQuestions: SavedQuestion[];
};
