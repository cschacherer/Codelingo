import { Category } from "../models/Category";
import { Difficulty } from "../models/Difficulty";
import { Question } from "../models/Question";
import { SavedQuestion } from "../models/SavedQuestion";
import { Type } from "../models/Type";
import { getErrorMessage } from "../utils/utils";
import apiClient from "./apiClient";

export const generateQuestion = async (
    category: Category | string,
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
            "/questions/generate",
            parameters
        );
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};

export const saveQuestion = async (question: SavedQuestion) => {
    try {
        const response = await apiClient.post<SavedQuestion>(
            "/questions/save",
            question
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

export const deleteQuestion = async (questionId: number) => {
    try {
        const response = await apiClient.delete<SavedQuestion>(
            `/questions/${questionId}`
        );
        return response.data;
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        throw new Error(msg);
    }
};
