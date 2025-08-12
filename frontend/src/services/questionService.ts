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

export const saveQuestion = async (
    id: number,
    category: Category | string,
    difficulty: Difficulty | string,
    type: Type | string,
    question: string,
    answer: string,
    userAnswer: string,
    notes: string
) => {
    try {
        const questionData = {
            id: id,
            category: category,
            difficulty: difficulty,
            type: type,
            question: question,
            answer: answer,
            userAnswer: userAnswer,
            notes: notes,
        };
        const response = await apiClient.post<SavedQuestion>(
            "/questions/save",
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
