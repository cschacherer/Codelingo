import { Category } from "../models/Category";
import { Difficulty } from "../models/Difficulty";
import { Type } from "../models/Type";

//used for UI testing when I don't need a LLM question generated
export abstract class Defaults {
    public static question = `Write a Python function called is_even that takes an integer as input and returns True if the number is even and False if it is odd.

Example:

print(is_even(4))  # Output: True  
print(is_even(7))  # Output: False  
  `;

    public static answer = `def is_even(n):
    return n % 2 == 0

# Test cases
print(is_even(4))  # Output: True
print(is_even(7))  # Output: False`;

    public static error = "";

    public static category = Category.Python;
    public static difficulty = Difficulty.Easy;
    public static type = Type.Coding;
}
