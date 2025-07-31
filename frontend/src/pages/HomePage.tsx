// import Container from "react-bootstrap/Container";
// import IQuestionInterface from "../components/IQuestionOptions";
// import { Defaults } from "../defaults";

import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import QuestionContainer from "../components/QuestionContainer/QuestionContainer";
import IQuestionOptions from "../components/IQuestionOptions";
import SideBar from "../components/SideBar/SideBar";
import owlIcon from "../assets/owlIcon.svg";
import { Defaults } from "../utils/defaults";
import {
    Category,
    Difficulty,
    Type,
    getCategoryFromString,
    getDifficultyFromString,
    getTypeFromString,
} from "../utils/enumOptions";
import "./css/HomePage.css";
import { getErrorMessage } from "../utils/utils";
import { useAuth } from "../context/authContext";
import { generateQuestion, saveQuestion } from "../services/questionService";

const HomePage = () => {
    let auth = useAuth();

    let useDefaultQuestion = false; //will use one question over and over again, instead of constantly asking and loading a new question from the llm

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [questionCategory, setQuestionCategory] = useState(Category.Python);
    const [questionDifficulty, setQuestionDifficulty] = useState(
        Difficulty.Easy
    );
    const [questionType, setQuestionType] = useState(Type.Coding);

    const [isLoading, setIsLoading] = useState(false);

    const [questionIsSaved, setQuestionIsSaved] = useState(false);

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

            const data = await generateQuestion(category, difficulty, type);
            setQuestion(data.question);
            setAnswer(data.answer);
            setQuestionCategory(getCategoryFromString(data.category));
            setQuestionDifficulty(getDifficultyFromString(data.difficulty));
            setQuestionType(getTypeFromString(data.type));
        } catch (err) {
            let msg = getErrorMessage(err);
            setQuestion(msg);
            setAnswer("");
        } finally {
            setIsLoading(false);
        }
    };

    const saveQuestionFunction = async (
        formattedQuestion: string,
        formattedAnswer: string,
        userAnswer: string
    ) => {
        try {
            const data = await saveQuestion(
                questionCategory,
                questionDifficulty,
                questionType,
                formattedQuestion,
                formattedAnswer,
                userAnswer,
                ""
            );
            setQuestionIsSaved(true);
        } catch (err) {
            let msg = getErrorMessage(err);
            console.log(msg);
            setQuestionIsSaved(false);
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
                        handleSaveQuestion={saveQuestionFunction}
                        isSaved={questionIsSaved}
                    ></QuestionContainer>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
