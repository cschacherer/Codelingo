// import Container from "react-bootstrap/Container";
// import IQuestionInterface from "../components/IQuestionOptions";
// import { Defaults } from "../defaults";

import { CanceledError } from "axios";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import QuestionContainer from "../components/QuestionContainer/QuestionContainer";
import IQuestionOptions from "../components/IQuestionOptions";
import SideBar from "../components/SideBar/SideBar";
import owlIcon from "../assets/owlIcon.svg";
import { Defaults } from "../helpers/defaults";
import {
    Category,
    Difficulty,
    Type,
    getCategoryFromString,
    getDifficultyFromString,
    getTypeFromString,
} from "../helpers/enumOptions";
import "./css/HomePage.css";
import apiClient from "../services/apiClient";
import { getErrorMessage } from "../helpers/utils";

const HomePage = () => {
    let useDefaultQuestion = false; //will use one question over and over again, instead of constantly asking and loading a new question from the llm

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [questionCategory, setQuestionCategory] = useState(Category.Python);
    const [questionDifficulty, setQuestionDifficulty] = useState(
        Difficulty.Easy
    );
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
            const response = await apiClient.post(
                "/generate_question",
                jsonBody,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                    },
                }
            );
            let jsonData = response.data;

            try {
                let parsedJSONData = JSON.parse(jsonData.question);

                let parsedQuestion =
                    parsedJSONData.question ||
                    parsedJSONData.Question ||
                    parsedJSONData.QUESTION;
                if (parsedQuestion) {
                    setQuestion(parsedQuestion);
                } else {
                    setQuestion("Error parsing question. Please try again.");
                }

                let parsedAnswer =
                    parsedJSONData.answer ||
                    parsedJSONData.Answer ||
                    parsedJSONData.ANSWER;
                if (parsedAnswer) {
                    setAnswer(parsedAnswer);
                } else {
                    setAnswer("Error parsing answer. Please try again.");
                }
            } catch (e: any) {
                setQuestion(`Error parsing question. ${e.message}`);
                setAnswer("");
            }

            setQuestionCategory(getCategoryFromString(category));
            setQuestionDifficulty(getDifficultyFromString(difficulty));
            setQuestionType(getTypeFromString(type));
        } catch (err) {
            let msg = getErrorMessage(err);
            console.log(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const saveQuestionFunction = async () => {
        try {
            const questionDetails = {
                category: questionCategory,
                difficulty: questionDifficulty,
                type: questionType,
                question: question,
                answer: answer,
                notes: "",
                userAnswer: "user answer here",
            };
            const response = await apiClient.post(
                "/savequestion",
                questionDetails
            );

            const x = response.data;
        } catch (e) {
        } finally {
        }
    };

    const questionOptions: IQuestionOptions = {
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
                        icon={owlIcon}
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
                        handleSaveQuestionClick={saveQuestionFunction}
                    ></QuestionContainer>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
