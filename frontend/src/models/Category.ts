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

export const getCategoryFromString = (category: string): Category => {
    return Object.values(Category).find(
        (x) => x.toLowerCase() === category.toLowerCase()
    ) as Category;
};
