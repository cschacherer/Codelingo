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

  const [error, setError] = useState("");

  const [questionCategory, setQuestionCategory] = useState(Category.Python);
  const [questionDifficulty, setQuestionDifficulty] = useState(Difficulty.Easy);
  const [questionType, setQuestionType] = useState(Type.Coding);

  const [isLoading, setIsLoading] = useState(false);

  type QAResponseObject = Record<string, string>;

  const normalizeKeys = (obj: QAResponseObject): QAResponseObject => {
    const normalized: QAResponseObject = {};
    Object.keys(obj).forEach((key) => {
      const cleanKey = key.replace(/['"]+/g, "").toLowerCase(); // Remove quotes and normalize case
      normalized[cleanKey] = obj[key];
    });
    return normalized;
  };

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

      try {
        let parsedJSONData = JSON.parse(jsonData);

        // let jsonKeys = Object.keys(parsedJSONData);

        // for (let key in jsonKeys) {
        //   if (key.toString().toLowerCase() === "question") {
        //     setQuestion(`${parsedJSONData[key]}`);
        //   } else if (key.toString().toLowerCase() === "answer") {
        //     setAnswer(`${parsedJSONData[key]}`);
        //   }
        // }

        // setQuestion(
        //   `\`\`\ ${
        //     parsedJSONData.question ||
        //     parsedJSONData.Question ||
        //     parsedJSONData.QUESTION ||
        //     "PARSING ERROR"
        //   }\`\`\``
        // );

        // setAnswer(
        //   `\`\`\` \n ${
        //     parsedJSONData.answer ||
        //     parsedJSONData.Answer ||
        //     parsedJSONData.Answer ||
        //     "PARSING ERROR"
        //   } \n \`\`\``
        // );

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

      // let escapedJSONString: string = JSON.stringify(response.data); //makes sure all characters are properly escaped for formatting

      // setQuestion(escapedJSONString);
      // setAnswer(escapedJSONString);

      // let parsedJSONData = JSON.parse(jsonData);
      // setQuestion(
      //   `${
      //     parsedJSONData.question ||
      //     parsedJSONData.Question ||
      //     parsedJSONData.QUESTION ||
      //     "PARSING ERROR"
      //   }`
      // );

      // setAnswer(
      //   `${
      //     parsedJSONData.answer ||
      //     parsedJSONData.Answer ||
      //     parsedJSONData.Answer ||
      //     "PARSING ERROR"
      //   }`
      // );

      // try {
      //   let parsedJSONData = JSON.parse(jsonData);
      //   let keyValues = Object.keys(parsedJSONData);
      // } catch (e: any) {
      //   setQuestion(response.data);
      //   setAnswer(response.data);
      // }
      // let parsedJSONData = JSON.parse(jsonData);
      // let keyValues = Object.keys(parsedJSONData);

      // let escapedJSONString: string = JSON.stringify(response.data); //makes sure all characters are properly escaped for formatting
      // escapedJSONString = escapedJSONString.replace("```", "```");

      // let keyValues2 = Object.keys(jsonData);

      // for (const k in Object.keys(parsedJSONData)) {
      //   if (k.toString().toLowerCase() === "question") {
      //     setQuestion(parsedJSONData[k].toString());
      //   } else if (k.toString().toLowerCase() === "answer") {
      //     setAnswer(parsedJSONData[k].toString());
      //   }
      // }

      // if (typeof response.data === "string") {
      //   try {
      //     console.log("Is string.");
      //     jsonData = JSON.parse(x);
      //     let z = jsonData.Question;
      //   } catch (e: any) {
      //     console.log(e.message);
      //     setQuestion(response.data);
      //     setAnswer(response.data);
      //   }
      // } else {
      //   setQuestion(normalizedData.question);
      //   setAnswer(normalizedData.answer);
      // }

      setQuestionCategory(getCategoryFromString(category));
      setQuestionDifficulty(getDifficultyFromString(difficulty));
      setQuestionType(getTypeFromString(type));
    } catch (err: unknown) {
      if (err instanceof CanceledError) return;
      if (err instanceof Error) setError(err.message);
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
