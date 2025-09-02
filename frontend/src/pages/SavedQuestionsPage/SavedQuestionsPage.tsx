import { SavedQuestion } from "../../models/SavedQuestion";
import { Button } from "react-bootstrap";
import style from "./SavedQuestionsPage.module.css";
import { useEffect, useState } from "react";
import { getUser } from "../../services/userService";
import NavigationBar from "../../components/Navigation/NavigationBar";
import { useAuth } from "../../context/authContext";
import Header from "../../components/Header/Header";
import QuestionModal from "../../components/QuestionModal/QuestionModal";
import {
    saveQuestion,
    deleteQuestion,
    analyzeAnswer,
} from "../../services/questionService";
import useConfirm from "../../components/ConfirmDialog/ConfirmDialog";

const SavedQuestionsPage = () => {
    const [questions, setQuestions] = useState<SavedQuestion[]>([]);

    const [showRetryDialog, setShowRetryDialog] = useState(false);
    const [retryQuestion, setRetryQuestion] = useState<SavedQuestion | null>(
        null
    );

    const [showAnswers, setShowAnswers] = useState(false);

    const auth = useAuth();

    const [confirmDelete, ConfirmDeleteDialog] = useConfirm();

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
        newNotes: string,
        newAnalyzedAnswer: string
    ) => {
        try {
            question.userAnswer = newUserAnswer;
            question.notes = newNotes;
            question.analyzedAnswer = newAnalyzedAnswer;
            await saveQuestion(question);
            await getUserData();
        } catch (e) {
            console.log((e as Error).message);
        } finally {
            setShowRetryDialog(false);
        }
    };

    const analyzeUserAnswer = async (
        question: SavedQuestion,
        newUserAnswer: string
    ) => {
        try {
            const response = await analyzeAnswer(
                question.category,
                question.question,
                question.answer,
                newUserAnswer
            );
            return response;
        } catch (e) {
            console.log((e as Error).message);
        }
    };

    const handleDeleteQuestion = async (questionId: number) => {
        try {
            const confirm = await confirmDelete(
                "Are you sure you want to permanently delete this question?"
            );
            if (!confirm) return;
            await deleteQuestion(questionId);
            await getUserData();
        } catch (e) {
            console.log((e as Error).message);
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
                            <th
                                className={style.savedQuestions__width5}
                                scope="col"
                            >
                                Category
                            </th>
                            <th
                                className={style.savedQuestions__width5}
                                scope="col"
                            >
                                Difficulty
                            </th>
                            <th
                                className={style.savedQuestions__width5}
                                scope="col"
                            >
                                Type
                            </th>
                            <th
                                className={style.savedQuestions__colQuestion}
                                scope="col"
                            >
                                Question
                            </th>
                            {showAnswers && (
                                <th
                                    className={style.savedQuestions__width15}
                                    scope="col"
                                >
                                    Your Answer
                                </th>
                            )}
                            {showAnswers && (
                                <th
                                    className={style.savedQuestions__width15}
                                    scope="col"
                                >
                                    Answer Analysis
                                </th>
                            )}
                            {showAnswers && (
                                <th
                                    className={style.savedQuestions__width15}
                                    scope="col"
                                >
                                    Answer
                                </th>
                            )}
                            {showAnswers && (
                                <th
                                    className={style.savedQuestions__width5}
                                    scope="col"
                                >
                                    Notes
                                </th>
                            )}
                            <th
                                className={
                                    style.savedQuestions__hiddenColHeader
                                }
                                scope="col"
                            ></th>
                            <th
                                className={
                                    style.savedQuestions__hiddenColHeader
                                }
                                scope="col"
                            ></th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions?.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td
                                        className={style.savedQuestions__width5}
                                    >
                                        {item.category}
                                    </td>
                                    <td
                                        className={style.savedQuestions__width5}
                                    >
                                        {item.difficulty}
                                    </td>
                                    <td
                                        className={style.savedQuestions__width5}
                                    >
                                        {item.type}
                                    </td>
                                    <td
                                        className={
                                            style.savedQuestions__colQuestion
                                        }
                                    >
                                        {item.question}
                                    </td>
                                    {showAnswers && (
                                        <td
                                            className={
                                                style.savedQuestions__width15
                                            }
                                        >
                                            {item.userAnswer}
                                        </td>
                                    )}
                                    {showAnswers && (
                                        <td
                                            className={
                                                style.savedQuestions__width15
                                            }
                                        >
                                            {item.analyzedAnswer}
                                        </td>
                                    )}
                                    {showAnswers && (
                                        <td
                                            className={
                                                style.savedQuestions__width15
                                            }
                                        >
                                            {item.answer}
                                        </td>
                                    )}
                                    {showAnswers && (
                                        <td
                                            className={
                                                style.savedQuestions__width5
                                            }
                                        >
                                            {item.notes}
                                        </td>
                                    )}
                                    <td
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
                                            {showAnswers ? "View" : "Retry"}
                                        </Button>
                                    </td>
                                    <td
                                        className={
                                            style.savedQuestions__buttonCell
                                        }
                                    >
                                        <Button
                                            className={
                                                style.savedQuestions__button
                                            }
                                            variant="light"
                                            onClick={() =>
                                                handleDeleteQuestion(item.id)
                                            }
                                        >
                                            Delete
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
                    handleAnalyzeAnswer={analyzeUserAnswer}
                ></QuestionModal>
                <ConfirmDeleteDialog />
            </div>
        </div>
    );
};

export default SavedQuestionsPage;
