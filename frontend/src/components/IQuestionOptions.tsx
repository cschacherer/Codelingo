import { Category } from "../utils/enumOptions";

interface IQuestionOptions {
    categoryLabel: string;
    categoryOptions: Category[];
    difficultyLabel: string;
    difficultyOptions: string[];
    typeLabel: string;
    typeOptions: string[];
}

export default IQuestionOptions;
