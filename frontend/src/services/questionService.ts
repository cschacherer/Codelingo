import { getErrorMessage } from "../utils/utils";
import apiClient from "./apiClient";
import { Question, SavedQuestion } from "../models/questions";
import { Category, Difficulty, Type } from "../utils/enumOptions";

export const generateQuestion = async (
    category: Category,
    difficulty: Difficulty,
    type: Type
) => {
    try {
        const parameters = {
            category: category,
            difficulty: difficulty,
            type: type,
        };
        const response = await apiClient.post<Question>(
            "/generate_question",
            parameters
        );
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};

export const saveQuestion = async (
    category: Category,
    difficulty: Difficulty,
    type: Type,
    question: string,
    answer: string,
    userAnswer: string,
    notes: string
) => {
    try {
        const questionData = {
            category: category,
            difficulty: difficulty,
            type: type,
            question: question,
            answer: answer,
            userAnswer: userAnswer,
            notes: notes,
        };
        const response = await apiClient.post<SavedQuestion>(
            "/questions",
            questionData
        );
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};

export const getQuestion = async (questionId: number) => {
    try {
        const response = await apiClient.get<SavedQuestion>(
            `/questions/${questionId}`
        );
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};

export const getAllQuestions = async () => {
    try {
        const response = await apiClient.get<SavedQuestion[]>(`/questions`);
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};
