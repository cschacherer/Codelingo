import Container from "react-bootstrap/Container";
import IQuestionInterface from "./components/IQuestionOptions";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import QuestionContainer from "./components/QuestionContainer/QuestionContainer";
import icon from "./assets/owlIcon.svg";

import "./App.css";
import SideBar from "./components/SideBar/SideBar";
import { useEffect, useState } from "react";
import axios, { CanceledError } from "axios";
import { Button } from "react-bootstrap";

function App() {
  const [question, setQuestion] = useState("test");
  const [answer, setAnswer] = useState("test");

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateQuestionFunction;
  }, []);

  const generateQuestionFunction = async (
    category: string,
    difficulty: string,
    type: string
  ) => {
    try {
      setIsLoading(true);
      const request = await axios.get(
        "http://127.0.0.1:5000/generate_question",
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          },
          params: {
            category: category,
            difficulty: difficulty,
            type: type,
          },
        }
      );
      const response = await request;
      let jsonData = response.data;
      if (typeof response.data === "string") {
        jsonData = JSON.parse(response.data);
      }
      setQuestion(jsonData.question);
      setAnswer(jsonData.answer);
    } catch (err: unknown) {
      if (err instanceof CanceledError) return;
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const questionOptions: IQuestionInterface = {
    categoryLabel: "Categories",
    categoryOptions: ["Python", "JavaScript", "React", "C#"],
    difficultyLabel: "Difficulty",
    difficultyOptions: ["Easy", "Intermediate", "Hard"],
    typeLabel: "Type",
    typeOptions: ["Coding", "Theoretical"],
  };

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
          ></QuestionContainer>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
