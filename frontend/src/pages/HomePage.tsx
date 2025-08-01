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
import { Category, Difficulty, Type } from "../utils/enumOptions";
import "./css/HomePage.css";
import { getErrorMessage } from "../utils/utils";
import { useAuth } from "../context/authContext";
import { generateQuestion, saveQuestion } from "../services/questionService";
import NavBar from "../components/Navigation/NavBar";

const HomePage = () => {
    let auth = useAuth();

    let useDefaultQuestion = false; //will use one question over and over again, instead of constantly asking and loading a new question from the llm

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    //these variables are updated when the dropdown selection changes
    const [selectedCategory, setSelectedCategory] = useState(Category.Python);
    const [selectedDifficulty, setSelectedDifficulty] = useState(
        Difficulty.Easy
    );
    const [selectedType, setSelectedType] = useState(Type.Coding);

    //These variables are only updated when a question is generated - it will mess with the
    //question component Coding Editor if it changes to a different category when the dropdown changes
    const [questionCategory, setQuestionCategory] = useState(selectedCategory);
    const [questionDifficulty, setQuestionDifficulty] = useState(
        Difficulty.Easy
    );
    const [questionType, setQuestionType] = useState(Type.Coding);

    const [isLoading, setIsLoading] = useState(false);

    const [questionIsSaved, setQuestionIsSaved] = useState(false);

    const generateQuestionFunction = async (
        category: Category,
        difficulty: Difficulty,
        type: Type
    ) => {
        try {
            if (useDefaultQuestion) {
                setQuestion(Defaults.question);
                setAnswer(Defaults.answer);

                setSelectedCategory(Defaults.category);
                setSelectedDifficulty(Defaults.difficulty);
                setSelectedType(Defaults.type);

                setQuestionCategory(Defaults.category);
                setQuestionDifficulty(Defaults.difficulty);
                setQuestionType(Defaults.type);
                return;
            }

            setIsLoading(true);

            const data = await generateQuestion(category, difficulty, type);
            setQuestion(data.question);
            setAnswer(data.answer);
            setQuestionCategory(category);
            setQuestionDifficulty(difficulty);
            setQuestionType(type);
        } catch (err) {
            let msg = getErrorMessage(err);
            setQuestion(msg);
            setAnswer("");
        } finally {
            setIsLoading(false);
            setQuestionIsSaved(false);
        }
    };

    const saveQuestionFunction = async (
        formattedQuestion: string,
        formattedAnswer: string,
        userAnswer: string
    ) => {
        try {
            const data = await saveQuestion(
                selectedCategory,
                selectedDifficulty,
                selectedType,
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

    const updateCategoryChanged = (newValue: Category) => {
        setSelectedCategory(newValue);
    };

    const updateDifficultyChanged = (newValue: Difficulty) => {
        setSelectedDifficulty(newValue);
    };

    const updateTypeChanged = (newValue: Type) => {
        setSelectedType(newValue);
    };

    const questionOptions: IQuestionOptions = {
        categoryLabel: "Categories",
        categoryOptions: Object.values(Category) as Category[],
        difficultyLabel: "Difficulty",
        difficultyOptions: Object.values(Difficulty) as Difficulty[],
        typeLabel: "Type",
        typeOptions: Object.values(Type) as Type[],
    };

    useEffect(() => {
        generateQuestionFunction(
            selectedCategory,
            selectedDifficulty,
            selectedType
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
                        selectedCategory={selectedCategory}
                        selectedDifficulty={selectedDifficulty}
                        selectedType={selectedType}
                        handleCategoryChange={updateCategoryChanged}
                        handleDifficultyChange={updateDifficultyChanged}
                        hanldeTypeChange={updateTypeChanged}
                        handleOnClick={generateQuestionFunction}
                        loading={isLoading}
                    ></SideBar>
                </Col>
                <Col className="questionBackground">
                    <Container>
                        <NavBar loggedIn={auth.loggedIn}></NavBar>
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
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
