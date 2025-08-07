import { useState, useEffect } from "react";
import QuestionContainer from "../../components/QuestionContainer/QuestionContainer";
import SideBar from "../../components/SideBar/SideBar";
import owlIcon from "../../assets/owlIcon.png";
import { Defaults } from "../../utils/questionDefaults";
import { getErrorMessage } from "../../utils/utils";
import { useAuth } from "../../context/authContext";
import { generateQuestion, saveQuestion } from "../../services/questionService";
import NavigationBar from "../../components/Navigation/NavigationBar";
import { QuestionOptions } from "../../models/QuestionOptions";
import { Category } from "../../models/Category";
import { Difficulty } from "../../models/Difficulty";
import { Type } from "../../models/Type";
import style from "./HomePage.module.css";

const HomePage = () => {
    let auth = useAuth();

    let useDefaultQuestion = true; //will use one question over and over again, instead of constantly asking and loading a new question from the llm

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    //these variables are updated when the dropdown selection changes
    //These are the default question values when the home page is first loaded
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
    const [currentQuestionId, setCurrentQuestionId] = useState<number>(-1);

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
            if (currentQuestionId !== -1) {
                //ask to override question
            }
            const data = await saveQuestion(
                currentQuestionId,
                selectedCategory,
                selectedDifficulty,
                selectedType,
                formattedQuestion,
                formattedAnswer,
                userAnswer,
                ""
            );
            setQuestionIsSaved(true);
            setCurrentQuestionId(data.id);
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
    }, []);

    return (
        <div className={style.homePage__container}>
            <div className={style.homePage__sideBarColumn}>
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
            </div>
            <div className={style.homePage__questionColumn}>
                <NavigationBar
                    loggedIn={auth.loggedIn}
                    onUserPage={false}
                ></NavigationBar>
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
            </div>
        </div>
    );
};

export default HomePage;
