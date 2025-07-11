import Container from "react-bootstrap/Container";
import IQuestionInterface from "./components/IQuestionOptions";
import { Defaults } from "./defaults";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import QuestionContainer from "./components/QuestionContainer/QuestionContainer";
import icon from "./assets/owlIcon.svg";

import "./App.css";
import SideBar from "./components/SideBar/SideBar";
import { useEffect, useState } from "react";
import axios, { CanceledError } from "axios";
import {
  Category,
  Difficulty,
  Type,
  getCategoryFromString,
  getDifficultyFromString,
  getTypeFromString,
} from "./enumOptions";

function App() {
  let useDefaultQuestion = false; //will use one question over and over again, instead of constantly asking and loading a new question from the llm

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [questionCategory, setQuestionCategory] = useState(Category.Python);
  const [questionDifficulty, setQuestionDifficulty] = useState(Difficulty.Easy);
  const [questionType, setQuestionType] = useState(Type.Coding);

  const [isLoading, setIsLoading] = useState(false);

  const generateQuestionFunction = async (
    category: string,
    difficulty: string,
    type: string
  ) => {
    try {
      if (useDefaultQuestion) {
        setQuestion(Defaults.question);
        setAnswer(Defaults.answer);
        setQuestionCategory(Defaults.category);
        setQuestionDifficulty(Defaults.difficulty);
        setQuestionType(Defaults.type);
        return;
      }

      setIsLoading(true);
      const jsonBody = {
        category: category,
        difficulty: difficulty,
        type: type,
      };
      const request = await axios.post(
        "http://127.0.0.1:5000/generate_question",
        jsonBody,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          },
        }
      );
      const response = await request;
      let jsonData = response.data;

      try {
        let parsedJSONData = JSON.parse(jsonData.question);

        setQuestion(
          parsedJSONData.question ||
            parsedJSONData.Question ||
            parsedJSONData.QUESTION ||
            "PARSING ERROR"
        );

        setAnswer(
          parsedJSONData.answer ||
            parsedJSONData.Answer ||
            parsedJSONData.Answer ||
            "PARSING ERROR"
        );
      } catch (e: any) {
        setQuestion(jsonData);
        setAnswer(jsonData);
      }

      setQuestionCategory(getCategoryFromString(category));
      setQuestionDifficulty(getDifficultyFromString(difficulty));
      setQuestionType(getTypeFromString(type));
    } catch (err) {
      if (err instanceof CanceledError) return;
      if (err instanceof Error) {
        console.log(err.message + " " + err.stack);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const questionOptions: IQuestionInterface = {
    categoryLabel: "Categories",
    categoryOptions: Object.values(Category) as string[],
    difficultyLabel: "Difficulty",
    difficultyOptions: Object.values(Difficulty) as string[],
    typeLabel: "Type",
    typeOptions: Object.values(Type) as string[],
  };

  useEffect(() => {
    generateQuestionFunction(
      questionCategory,
      questionDifficulty,
      questionType
    );
  }, []);

  return (
    <Container id="mainContainer">
      <Row className="vh-100">
        <Col className="noPadding" id="sideWidth">
          <SideBar
            name="CodeLingo"
            icon={icon}
            options={questionOptions}
            handleOnClick={generateQuestionFunction}
            loading={isLoading}
          ></SideBar>
        </Col>
        <Col className="questionBackground">
          <QuestionContainer
            title="New Question"
            question={question}
            answer={answer}
            questionCategory={questionCategory}
            questionDifficulty={questionDifficulty}
            questionType={questionType}
          ></QuestionContainer>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
