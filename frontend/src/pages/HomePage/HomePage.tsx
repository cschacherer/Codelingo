import { useState, useEffect } from "react";
import QuestionContainer from "../../components/QuestionContainer/QuestionContainer";
import SideBar from "../../components/SideBar/SideBar";
import { Defaults } from "../../utils/questionDefaults";
import { getErrorMessage } from "../../utils/utils";
import { useAuth } from "../../context/authContext";
import {
    generateQuestion,
    saveQuestion,
    analyzeAnswer,
} from "../../services/questionService";
import NavigationBar from "../../components/Navigation/NavigationBar";
import { QuestionOptions } from "../../models/QuestionOptions";
import { Category } from "../../models/Category";
import { Difficulty } from "../../models/Difficulty";
import { Type } from "../../models/Type";
import style from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import QuestionModal from "../../components/QuestionModal/QuestionModal";
import { SavedQuestion } from "../../models/SavedQuestion";

const HomePage = () => {
    let auth = useAuth();
    let navigate = useNavigate();

    let useDefaultQuestion = false; //will use one question over and over again, instead of constantly asking and loading a new question from the llm

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [userAnswer, setUserAnswer] = useState("");

    const [analyzedAnswer, setAnalyzedAnswer] = useState("");

    //these variables are updated when the dropdown selection changes
    //These are the default question values when the home page is first loaded
    const [selectedCategory, setSelectedCategory] = useState(Category.Python);
    const [selectedDifficulty, setSelectedDifficulty] = useState(
        Difficulty.Easy
    );
    const [selectedType, setSelectedType] = useState(Type.Coding);
    const [customCategory, setCustomCategory] = useState("");

    //These variables are only updated when a question is generated - it will mess with the
    //question component Coding Editor if it changes to a different category when the dropdown changes
    const [questionCategory, setQuestionCategory] = useState(selectedCategory);
    const [questionDifficulty, setQuestionDifficulty] = useState(
        Difficulty.Easy
    );
    const [questionType, setQuestionType] = useState(Type.Coding);

    const [questionIsLoading, setQuestionIsLoading] = useState(false);
    const [analyzeAnswerLoading, setAnalyzeAnswerLoading] = useState(false);

    //variables to handle saving the question
    const [questionIsSaved, setQuestionIsSaved] = useState(false);
    const [showSaveQuestionDialog, setShowSaveQuestionDialog] = useState(false);
    const [selectedSavedQuestion, setSelectedSavedQuestion] =
        useState<SavedQuestion | null>(null);

    const generateQuestionFunction = async (
        category: Category,
        difficulty: Difficulty,
        type: Type
    ) => {
        try {
            if (useDefaultQuestion) {
                setQuestion(Defaults.question);
                setAnswer(Defaults.answer);
                setUserAnswer("");

                setSelectedCategory(Defaults.category);
                setSelectedDifficulty(Defaults.difficulty);
                setSelectedType(Defaults.type);

                setQuestionCategory(Defaults.category);
                setQuestionDifficulty(Defaults.difficulty);
                setQuestionType(Defaults.type);
                return;
            }

            setQuestionIsLoading(true);

            const categoryToSend =
                category !== Category.Custom ? category : customCategory;

            const data = await generateQuestion(
                categoryToSend,
                difficulty,
                type
            );

            setQuestion(data.question);
            setAnswer(data.answer);
            setUserAnswer("");
            setAnalyzedAnswer("");
            setQuestionCategory(category);
            setQuestionDifficulty(difficulty);
            setQuestionType(type);
        } catch (err) {
            let msg = getErrorMessage(err);
            setQuestion(msg);
            setAnswer("");
        } finally {
            setQuestionIsLoading(false);
            setQuestionIsSaved(false);
            setSelectedSavedQuestion(null);
        }
    };

    const analyzeUserAnswer = async () => {
        try {
            setAnalyzeAnswerLoading(true);
            const response = await analyzeAnswer(
                selectedCategory,
                question,
                answer,
                userAnswer
            );
            setAnalyzedAnswer(response);
        } catch (err) {
            let msg = getErrorMessage(err);
            console.log(msg);
            setAnalyzedAnswer(msg);
        } finally {
            setAnalyzeAnswerLoading(false);
        }
    };

    const showSaveQuestionDialogFunction = async (
        formattedQuestion: string,
        formattedAnswer: string
    ) => {
        try {
            if (!auth.loggedIn) {
                navigate("login");
            }
            const questionValues: SavedQuestion = {
                id: selectedSavedQuestion ? selectedSavedQuestion.id : -1,
                category: selectedCategory,
                difficulty: selectedDifficulty,
                type: selectedType,
                question: formattedQuestion,
                answer: formattedAnswer,
                userAnswer: userAnswer,
                notes: selectedSavedQuestion ? selectedSavedQuestion.notes : "",
            };
            setSelectedSavedQuestion(questionValues);
            setShowSaveQuestionDialog(true);
        } catch (err) {
            let msg = getErrorMessage(err);
            console.log(msg);
            setShowSaveQuestionDialog(false);
        }
    };

    const saveQuestionToServer = async (
        passedQuestion: SavedQuestion,
        newUserAnswer: string,
        newNotes: string
    ) => {
        try {
            //only need the user answer or notes since that is the only thing that is editable
            if (!passedQuestion) {
                return;
            }
            passedQuestion.userAnswer = newUserAnswer;
            passedQuestion.notes = newNotes;
            const data = await saveQuestion(passedQuestion);
            if (userAnswer !== newUserAnswer) setUserAnswer(newUserAnswer); //in case the answer was modified in the Save Question Modal Dialog, update it on home page
            setQuestionIsSaved(true);
        } catch (err) {
            let msg = getErrorMessage(err);
            console.log(msg);
            setQuestionIsSaved(false);
        } finally {
            setShowSaveQuestionDialog(false);
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

    const updateCustomCategoryChanged = (newValue: string) => {
        setCustomCategory(newValue);
    };

    const updateUserAnswerChanged = (newValue: string) => {
        setUserAnswer(newValue);
    };

    const questionOptions: QuestionOptions = {
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
        auth.loginUser("admin", "admin123");
    }, []);

    return (
        <>
            <div className={style.homePage__container}>
                <div className={style.homePage__sideBarColumn}>
                    <SideBar
                        options={questionOptions}
                        selectedCategory={selectedCategory}
                        customCategory={customCategory}
                        selectedDifficulty={selectedDifficulty}
                        selectedType={selectedType}
                        handleCategoryChange={updateCategoryChanged}
                        handleCustomCategoryChange={updateCustomCategoryChanged}
                        handleDifficultyChange={updateDifficultyChanged}
                        handleTypeChange={updateTypeChanged}
                        handleOnClick={generateQuestionFunction}
                        loading={questionIsLoading}
                    ></SideBar>
                </div>
                <div className={style.homePage__questionColumn}>
                    <NavigationBar
                        loggedIn={auth.loggedIn}
                        onUserPage={false}
                    ></NavigationBar>
                    <QuestionContainer
                        question={question}
                        answer={answer}
                        questionCategory={questionCategory}
                        questionDifficulty={questionDifficulty}
                        questionType={questionType}
                        handleSaveQuestion={showSaveQuestionDialogFunction}
                        isSaved={questionIsSaved}
                        userAnswer={userAnswer}
                        handleUserAnswerChanged={updateUserAnswerChanged}
                        analyzedAnswer={analyzedAnswer}
                        handleAnalyzeAnswer={analyzeUserAnswer}
                        isLoading={analyzeAnswerLoading}
                    ></QuestionContainer>
                </div>
                {/* need to wait for selectedSavedQuestion to be a valid value, otherwise it causes issues when 
            rendering QuestionModal */}
                {selectedSavedQuestion && showSaveQuestionDialog && (
                    <QuestionModal
                        showDialog={showSaveQuestionDialog}
                        question={selectedSavedQuestion}
                        saveQuestionToServer={saveQuestionToServer}
                        showAnswers={true}
                        handleCloseDialog={() =>
                            setShowSaveQuestionDialog(false)
                        }
                    ></QuestionModal>
                )}
            </div>
        </>
    );
};

export default HomePage;
