import { Button, Modal } from "react-bootstrap";
import style from "./QuestionModal.module.css";
import { useEffect, useState } from "react";
import { SavedQuestion } from "../../models/SavedQuestion";
import ReactMarkdown from "react-markdown";
import { Type } from "../../models/Type";
import CodeEditor from "../CodeEditor/CodeEditor";
import { getCategoryFromString } from "../../models/Category";
import questionContainerStyle from "../../components/QuestionContainer/QuestionContainer.module.css";

interface Props {
    question: SavedQuestion | null;
    sendUpdatedQuestion: (value: SavedQuestion) => void;
    showAnswers: boolean;
}

const QuestionModal = ({
    question,
    sendUpdatedQuestion,
    showAnswers,
}: Props) => {
    const [showDialog, setShowDialog] = useState(false);

    const [newUserAnswer, setNewUserAnswer] = useState("");
    const [newNotes, setNewNotes] = useState("");

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

    const closeDialog = () => {
        setShowDialog(false);
        question = null;
    };

    const saveChanges = () => {
        if (question !== null) {
            if (
                question.userAnswer !== newUserAnswer ||
                question.notes !== newNotes
            ) {
                question.userAnswer = newUserAnswer;
                question.notes = newNotes;
                sendUpdatedQuestion(question);
            }
        }
    };

    useEffect(() => {
        if (question) {
            if (showAnswers) {
                setNewUserAnswer(question.userAnswer);
                setNewNotes(question.notes);
            }

            setShowDialog(true);
        }
    }, [question]);

    return (
        <div>
            <Modal size="lg" show={showDialog} onHide={closeDialog}>
                <Modal.Header
                    className={style.questionModal__header}
                    closeButton
                >
                    <div className={style.qeustionModal__headerText}>
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
                            <text className={style.questionModal__text}>
                                {question?.category}
                            </text>
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
                            <text className={style.questionModal__text}>
                                {question?.type}
                            </text>
                        </div>
                        {/* question */}
                        <div className={style.questionModal__verticalProperty}>
                            <label className={style.questionModal__label}>
                                Question:
                            </label>
                            <div className={style.questionModal__textBox}>
                                <ReactMarkdown>
                                    {question?.question}
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
                        {/* answer */}
                        {showAnswers && (
                            <div
                                className={
                                    style.questionModal__verticalProperty
                                }
                            >
                                <label className={style.questionModal__label}>
                                    Answer:
                                </label>
                                <div className={style.questionModal__textBox}>
                                    <ReactMarkdown>
                                        {question?.answer}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                        {/* notes */}
                        {showAnswers && (
                            <div
                                className={
                                    style.questionModal__verticalProperty
                                }
                            >
                                <label className={style.questionModal__label}>
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
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className={style.questionModal__footer}>
                    <Button
                        className={style.questionModal__glowButton}
                        variant="light"
                        size="lg"
                        onClick={closeDialog}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={style.questionModal__glowButton}
                        variant="light"
                        size="lg"
                        onClick={saveChanges}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default QuestionModal;
