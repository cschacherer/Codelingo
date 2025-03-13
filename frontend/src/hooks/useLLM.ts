import { SetStateAction, useEffect, useState } from "react";
import llmService, { LlmResponse } from "../services/llmService";
import { CanceledError } from "../services/apiClient";

const useLLM = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [error, setError] = useState("");
    
    useEffect(() => {    
        
        const fetchData = async () => {
            try{
                const {request, cancelFunction} = await llmService.get<string>(); 
                const response = await request; 
                const updatedResponse = response.data.replace("```", ""); 
                const jsonResponse = JSON.parse(updatedResponse)
                setQuestion(jsonResponse.question);
                setAnswer(jsonResponse.answer);
            }            
            catch(err: unknown) {
                if (err instanceof CanceledError) return;
                if (err instanceof Error)
                    setError(err.message);
            };
        }

        fetchData(); 

        // return () => cancelFunction(); 
    }, []); 
    
    return { question, answer, error};
}

export default useLLM; 