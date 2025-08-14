import { SavedQuestion } from "../../models/SavedQuestion";
import { Button } from "react-bootstrap";
import style from "./SavedQuestionsPage.module.css";
import { useEffect, useState } from "react";
import { getUser } from "../../services/userService";
import NavigationBar from "../../components/Navigation/NavigationBar";
import { useAuth } from "../../context/authContext";
import Header from "../../components/Header/Header";
import QuestionModal from "../../components/QuestionModal/QuestionModal";
import { saveQuestion } from "../../services/questionService";

const SavedQuestionsPage = () => {
    const [questions, setQuestions] = useState<SavedQuestion[]>([]);

    const [showRetryDialog, setShowRetryDialog] = useState(false);
    const [retryQuestion, setRetryQuestion] = useState<SavedQuestion | null>(
        null
    );

    const [showAnswers, setShowAnswers] = useState(false);

    const auth = useAuth();

    const getUserData = async () => {
        try {
            const response = await getUser();
            console.log(response);
            setQuestions(response.savedQuestions);
        } catch (e) {
            console.log((e as Error).message);
        }
    };

    const sendUpdatedQuestion = async (
        question: SavedQuestion,
        newUserAnswer: string,
        newNotes: string
    ) => {
        try {
            question.answer = newUserAnswer;
            question.notes = newNotes;
            const response = await saveQuestion(question);
            await getUserData();
        } catch (e) {
            console.log((e as Error).message);
        } finally {
            setShowRetryDialog(false);
        }
    };

    const handleCloseRetryDialog = () => {
        setShowRetryDialog(false);
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div>
            <NavigationBar
                loggedIn={auth.loggedIn}
                onUserPage={true}
            ></NavigationBar>
            <div className={style.savedQuestions__container}>
                <div className={style.savedQuestions__headerBackground}>
                    <Header
                        title="Saved Questions"
                        defaultBackground={true}
                    ></Header>
                </div>
                <div className={style.savedQuestions__showAnswersContainer}>
                    <input
                        type="checkbox"
                        checked={showAnswers}
                        onChange={(e) => {
                            setShowAnswers(e.target.checked);
                            setRetryQuestion(null);
                        }}
                    ></input>
                    <label className={style.savedQuestions__showAnswers}>
                        Show Answers
                    </label>
                </div>
                <table className={style.savedQuestions__table}>
                    <thead className={style.savedQuestions__colHeader}>
                        <tr>
                            <th scope="col">Category</th>
                            <th scope="col">Difficulty</th>
                            <th scope="col">Type</th>
                            <th scope="col">Question</th>
                            {showAnswers && <th scope="col">Your Answer</th>}
                            {showAnswers && <th scope="col">Answer</th>}
                            {showAnswers && <th scope="col">Notes</th>}
                            <th scope="col">Retry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions?.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td width="5%">{item.category}</td>
                                    <td width="5%">{item.difficulty}</td>
                                    <td width="5%">{item.type}</td>
                                    {showAnswers ? (
                                        <td width="25%">{item.question}</td>
                                    ) : (
                                        <td width="100%">{item.question}</td>
                                    )}
                                    {showAnswers && (
                                        <td width="25%">{item.userAnswer}</td>
                                    )}
                                    {showAnswers && (
                                        <td width="25%">{item.answer}</td>
                                    )}
                                    {showAnswers && (
                                        <td width="25%">{item.notes}</td>
                                    )}
                                    <td
                                        width="auto"
                                        className={
                                            style.savedQuestions__buttonCell
                                        }
                                    >
                                        <Button
                                            className={
                                                style.savedQuestions__button
                                            }
                                            variant="light"
                                            onClick={() => {
                                                setRetryQuestion(item);
                                                setShowRetryDialog(true);
                                            }}
                                        >
                                            Retry
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <QuestionModal
                    showDialog={showRetryDialog}
                    question={retryQuestion}
                    saveQuestionToServer={sendUpdatedQuestion}
                    showAnswers={showAnswers}
                    handleCloseDialog={handleCloseRetryDialog}
                ></QuestionModal>
            </div>
        </div>
    );
};

export default SavedQuestionsPage;
