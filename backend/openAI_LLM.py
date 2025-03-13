import os
from openai import OpenAI

class openAI_LLM(): 

    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.environ.get("OPENAI_API_KEY")
        )

    def generateQuestion(self, subject, difficulty, type):
        if(type.lower() == "coding"): 
            typeMsg = "Create this question so the user has to write code for the answer.  Send back any code written in a readable format."
        if (type.lower() == "theoretical"): 
            typeMsg = "Create this question so that the answer is theoretical, do not use a question where the user will need to write code."

        separateMsg = "Format the response into one json object.  Use the json key 'question' for the question section and the json key 'answer' for the answer section.  Make sure the question section and answer section can be parsed from a string to a JSON object. Only return the json object, do not add any characters before or after it."
        completion = self.client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages= [
                {"role": "system", "content": "You will write questions that coders can use to test thier knowledge of coding subjects. Generate a coding question and what the answer to that question would be."}, 
                {"role": "user", "content": f"Write a coding interview question to test a user's {subject} skills.  The difficulty of this question should be {difficulty}. {typeMsg}. {separateMsg}"}
            ] 
        )  
        return completion.choices[0].message.content