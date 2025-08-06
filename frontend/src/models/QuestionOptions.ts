import { Category } from "./Category";
import { Difficulty } from "./Difficulty";
import { Type } from "./Type";

export type QuestionOptions = {
    categoryLabel: string;
    categoryOptions: Category[];
    difficultyLabel: string;
    difficultyOptions: Difficulty[];
    typeLabel: string;
    typeOptions: Type[];
};
