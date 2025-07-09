import os
from groq import Groq
import json

class Groq_LLM(): 

    def __init__(self):
        self.client = Groq(
            api_key=os.environ.get("GROQ_API_KEY")
        )

    def generateQuestion(self, subject, difficulty, type): 
        try: 
            if(type.lower() == "coding"): 
                typeMsg = "Create this question so the user has to write code for the answer.  Send back any code written in a readable format."
            if (type.lower() == "theoretical"): 
                typeMsg = "Create this question so that the answer is theoretical, do not use a question where the user will need to write code."
                
            separateMsg = (
            "Respond with a **valid JSON object only**, with no additional text, formatting, or markdown. "
            "Your response must be **EXACTLY** in this format: "
            '{"question": "VALID_JSON_STRING", "answer": "VALID_JSON_STRING"}. '
            "Ensure both `Question` and `Answer` values are valid **escaped** JSON strings. "
            "Do not include markdown, explanations, code fences, or any additional text."
        )

            completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile", 
                messages= [
                    {"role": "system", "content": "You will write questions that coders can use to test their knowledge of coding subjects. Generate a coding question and what the answer to that question would be."}, 
                    {"role": "user", "content": f"Write a coding interview question to test a user's {subject} skills.  The difficulty of this question should be {difficulty}. {typeMsg}. {separateMsg}"}
                ] 
            )  

            jsonString = json.dumps(completion.choices[0].message.content)
            return jsonString
        
        except Exception as e: 
            return "Error generating question using OpenAI. " + repr(e); 

