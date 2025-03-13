import create from "./httpService"

export interface User {
  id: number;
  name: string;
}

export interface LlmResponse {
    question: string; 
    answer: string; 
}

export default create("/generate_question"); 