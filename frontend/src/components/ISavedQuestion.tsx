interface ISavedQuestion {
    id: number;
    category: string;
    difficulty: string;
    type: string;
    question: string;
    answer: string;
    userAnswer: string;
    notes: string;
    userId: number;
}

export default ISavedQuestion;
