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
