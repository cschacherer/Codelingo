export enum Category {
  Angular = "Angular",
  CSharp = "C#",
  CSS = "CSS",
  HTML = "HTML",
  Java = "Java",
  JavaScript = "JavaScript",
  JSON = "JSON",
  PHP = "PHP",
  Python = "Python",
  React = "React",
  SQL = "SQL",
  TypeScript = "TypeScript",
  Vue = "Vue",
  Custom = "Custom",
}

export enum Difficulty {
  Easy = "Easy",
  Intermediate = "Intermediate",
  Hard = "Hard",
}

export enum Type {
  Coding = "Coding",
  Theoretical = "Theoretical",
}

export const getCategoryFromString = (category: string): Category => {
  return Object.values(Category).find(
    (x) => x.toLowerCase() === category.toLowerCase()
  ) as Category;
};

export const getDifficultyFromString = (difficulty: string): Difficulty => {
  return Object.values(Difficulty).find(
    (x) => x.toLowerCase() === difficulty.toLowerCase()
  ) as Difficulty;
};

export const getTypeFromString = (type: string): Type => {
  return Object.values(Type).find(
    (x) => x.toLowerCase() === type.toLowerCase()
  ) as Type;
};
