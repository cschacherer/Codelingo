export enum Difficulty {
    Easy = "Easy",
    Intermediate = "Intermediate",
    Hard = "Hard",
}

export const getDifficultyFromString = (difficulty: string): Difficulty => {
    return Object.values(Difficulty).find(
        (x) => x.toLowerCase() === difficulty.toLowerCase()
    ) as Difficulty;
};
