import { Category } from "../utils/enumOptions";

export type Question = {
    category: string;
    difficulty: string;
    type: string;
    question: string;
    answer: string;
};

export type SavedQuestion = {
    id: number;
    category: string;
    difficulty: string;
    type: string;
    question: string;
    answer: string;
    userAnswer: string;
    notes: string;
    userId: number;
};

export type QuestionOptions = {
    categoryLabel: string;
    categoryOptions: Category[];
    difficultyLabel: string;
    difficultyOptions: string[];
    typeLabel: string;
    typeOptions: string[];
};
