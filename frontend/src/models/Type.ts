export enum Type {
    Coding = "Coding",
    Theoretical = "Theoretical",
}

export const getTypeFromString = (type: string): Type => {
    return Object.values(Type).find(
        (x) => x.toLowerCase() === type.toLowerCase()
    ) as Type;
};
