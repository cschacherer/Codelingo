import { Button, Modal } from "react-bootstrap";
import style from "./QuestionModal.module.css";
import { useEffect, useState } from "react";
import { SavedQuestion } from "../../models/SavedQuestion";
import ReactMarkdown from "react-markdown";
import { Type } from "../../models/Type";
import CodeEditor from "../CodeEditor/CodeEditor";
import { getCategoryFromString } from "../../models/Category";
import useConfirm from "../ConfirmDialog/ConfirmDialog";
import GlowButton from "../GlowButton/GlowButton";

interface Props {
    showDialog: boolean;
    question: SavedQuestion | null;
    saveQuestionToServer: (
        question: SavedQuestion,
        newUserAnswer: string,
        newNotes: string
    ) => void;
    showAnswers: boolean;
    handleCloseDialog: () => void;
}

const QuestionModal = ({
    showDialog,
    question,
    saveQuestionToServer,
    showAnswers,
    handleCloseDialog,
}: Props) => {
    if (!question) return null;

    const [newUserAnswer, setNewUserAnswer] = useState<string>(
        showAnswers && question ? question.userAnswer : ""
    );
    const [newNotes, setNewNotes] = useState<string>(
        showAnswers && question ? question.notes : ""
    );

    const [showAnswersLocally, setShowAnswersLocally] = useState(showAnswers);

    //const [confirmOverride, ConfirmOverrideDialog] = useConfirm();

    const handleNewUserAnswerChanged = (
        prop: string | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        if (typeof prop === "string") {
            setNewUserAnswer(prop);
        } else {
            setNewUserAnswer(prop.target.value);
        }
    };

    const handleNewNotesChanged = (
        prop: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setNewNotes(prop.target.value);
    };

    const handleShowAnswersLocally = () => {
        setNewNotes(question.notes);
        setShowAnswersLocally(true);
    };

    const handleCloseDialogLocally = () => {
        setNewUserAnswer("");
        setNewNotes("");
        setShowAnswersLocally(false);
        handleCloseDialog();
    };

    useEffect(() => {
        if (question) {
            if (showAnswers) {
                setNewUserAnswer(question.userAnswer);
                setNewNotes(question.notes);
                setShowAnswersLocally(true);
            } else {
                setShowAnswersLocally(false);
            }
        } else {
            console.log("queston: " + question);
        }
    }, [question, showAnswers]);

    return (
        <div>
            <Modal
                size="lg"
                show={showDialog}
                onHide={handleCloseDialogLocally}
            >
                <Modal.Header
                    className={style.questionModal__header}
                    closeButton
                >
                    <div className={style.questionModal__headerText}>
                        Saved Question
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className={style.questionModal__container}>
                        {/* category */}
                        <div
                            className={style.questionModal__horizontalProperty}
                        >
                            <label className={style.questionModal__label}>
                                Category:{" "}
                            </label>
                            <div className={style.questionModal__text}>
                                {question?.category}
                            </div>
                        </div>
                        {/* difficulty */}
                        <div
                            className={style.questionModal__horizontalProperty}
                        >
                            <label className={style.questionModal__label}>
                                Difficulty:{" "}
                            </label>
                            <div className={style.questionModal__text}>
                                {question?.difficulty}
                            </div>
                        </div>
                        {/* type */}
                        <div
                            className={style.questionModal__horizontalProperty}
                        >
                            <label className={style.questionModal__label}>
                                Type:
                            </label>
                            <div className={style.questionModal__text}>
                                {question?.type}
                            </div>
                        </div>
                        {/* question */}
                        <div className={style.questionModal__verticalProperty}>
                            <label className={style.questionModal__label}>
                                Question:
                            </label>
                            <div className={style.questionModal__textBox}>
                                <ReactMarkdown>
                                    {question
                                        ? question.question.toString()
                                        : ""}
                                </ReactMarkdown>
                            </div>
                        </div>
                        {/* userAnswer */}
                        <div className={style.questionModal__verticalProperty}>
                            <label className={style.questionModal__label}>
                                User Answer:
                            </label>
                            {question?.type == Type.Coding ? (
                                <div
                                    className={
                                        style.questionModal__codeEditorContainer
                                    }
                                >
                                    <CodeEditor
                                        questionCategory={getCategoryFromString(
                                            question?.category
                                        )}
                                        userAnswer={newUserAnswer}
                                        handleUserAnswerChanged={
                                            handleNewUserAnswerChanged
                                        }
                                    ></CodeEditor>
                                </div>
                            ) : (
                                <textarea
                                    className={style.questionModal__textBox}
                                    rows={8}
                                    cols={8}
                                    value={newUserAnswer}
                                    onChange={handleNewUserAnswerChanged}
                                ></textarea>
                            )}
                        </div>
                        {!showAnswersLocally && (
                            <div
                                className={
                                    style.questionModal__showAnswersButton
                                }
                            >
                                <GlowButton
                                    text="Show Answers"
                                    handleOnClick={handleShowAnswersLocally}
                                ></GlowButton>
                            </div>
                        )}

                        {showAnswersLocally && (
                            <>
                                {/* answer */}
                                <div
                                    className={
                                        style.questionModal__verticalProperty
                                    }
                                >
                                    <label
                                        className={style.questionModal__label}
                                    >
                                        Answer:
                                    </label>
                                    <div
                                        className={style.questionModal__textBox}
                                    >
                                        <ReactMarkdown>
                                            {question
                                                ? question.answer.toString()
                                                : ""}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                                {/* notes */}
                                <div
                                    className={
                                        style.questionModal__verticalProperty
                                    }
                                >
                                    <label
                                        className={style.questionModal__label}
                                    >
                                        Notes:
                                    </label>
                                    <textarea
                                        className={style.questionModal__textBox}
                                        rows={4}
                                        cols={8}
                                        value={newNotes}
                                        onChange={handleNewNotesChanged}
                                    ></textarea>
                                </div>
                            </>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className={style.questionModal__footer}>
                    <GlowButton
                        text="Cancel"
                        handleOnClick={handleCloseDialogLocally}
                    ></GlowButton>
                    <GlowButton
                        text="Save"
                        handleOnClick={() => {
                            setShowAnswersLocally(false);
                            saveQuestionToServer(
                                question,
                                newUserAnswer,
                                newNotes
                            );
                        }}
                    ></GlowButton>
                </Modal.Footer>
            </Modal>
            {/* <ConfirmOverrideDialog /> */}
        </div>
    );
};

export default QuestionModal;
