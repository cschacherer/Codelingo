import { Modal } from "react-bootstrap";
import style from "./QuestionModal.module.css";
import { useEffect, useState } from "react";
import { SavedQuestion } from "../../models/SavedQuestion";
import ReactMarkdown from "react-markdown";
import { Type } from "../../models/Type";
import CodeEditor from "../CodeEditor/CodeEditor";
import { getCategoryFromString } from "../../models/Category";
import useConfirm from "../ConfirmDialog/ConfirmDialog";
import GlowButton from "../GlowButton/GlowButton";
import { getErrorMessage } from "../../utils/utils";

interface Props {
    showDialog: boolean;
    question: SavedQuestion | null;
    saveQuestionToServer: (
        question: SavedQuestion,
        newUserAnswer: string,
        newNotes: string,
        newAnalysis: string
    ) => void;
    showAnswers: boolean;
    handleCloseDialog: () => void;
    handleAnalyzeAnswer: (
        question: SavedQuestion,
        newUserAnswer: string
    ) => Promise<string> | Promise<void>;
}

const QuestionModal = ({
    showDialog,
    question,
    saveQuestionToServer,
    showAnswers,
    handleCloseDialog,
    handleAnalyzeAnswer,
}: Props) => {
    if (!question) return null;

    const [newUserAnswer, setNewUserAnswer] = useState<string>(
        showAnswers && question ? question.userAnswer : ""
    );
    const [newNotes, setNewNotes] = useState<string>(question?.notes ?? "");
    const [newAnalyzedAnswer, setNewAnalyzedAnswer] = useState<string>(
        question?.analyzedAnswer ?? ""
    );
    const [showAnswersLocally, setShowAnswersLocally] = useState(showAnswers);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [confirmOverride, ConfirmOverrideDialog] = useConfirm();

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

    const handleAnalyzeAnswerLocally = async () => {
        try {
            setIsAnalyzing(true);
            const newAnalysis = await handleAnalyzeAnswer(
                question,
                newUserAnswer
            );
            if (typeof newAnalysis === "string") {
                setNewAnalyzedAnswer(newAnalysis);
            }
            setShowAnswersLocally(true);
        } catch (e) {
            let msg = getErrorMessage(e);
            setNewAnalyzedAnswer(msg);
        } finally {
            setIsAnalyzing(false);
        }
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

    const handleSaveClicked = async () => {
        //handle saving a brand new question
        if (question.id === -1) {
            await saveQuestionToServer(
                question,
                newUserAnswer,
                newNotes,
                newAnalyzedAnswer
            );
        } else {
            //handle saving changes to an existing question in the home page or saved questions page
            if (showAnswersLocally) {
                if (
                    newUserAnswer === question.userAnswer &&
                    newNotes === question.notes
                ) {
                    handleCloseDialogLocally();
                    return;
                }
            } else {
                if (newUserAnswer === question.userAnswer) {
                    handleCloseDialogLocally();
                    return;
                }
            }

            const response = await confirmOverride(
                "Do you want to override the values of the existing question?"
            );
            if (!response) {
                return;
            }

            setShowAnswersLocally(false);
            await saveQuestionToServer(
                question,
                newUserAnswer,
                newNotes,
                newAnalyzedAnswer
            );
        }
    };

    useEffect(() => {
        if (question) {
            setNewNotes(question.notes);
            setNewAnalyzedAnswer(question.analyzedAnswer);
            if (showAnswers) {
                setNewUserAnswer(question.userAnswer);
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
                backdrop="static"
            >
                <Modal.Header
                    className={style.questionModal__header}
                    closeButton
                >
                    <div className={style.questionModal__headerText}>
                        {!showAnswersLocally
                            ? "Retry Saved Question"
                            : "Saved Question"}
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
                                    style.questionModal__answerButtonsContainer
                                }
                            >
                                {/* analyze answer button */}
                                <div
                                    className={
                                        style.questionModal__showAnswersButton
                                    }
                                >
                                    <GlowButton
                                        text="Analyze Answer"
                                        handleOnClick={
                                            handleAnalyzeAnswerLocally
                                        }
                                        loading={isAnalyzing}
                                        loadingText="Analyzing Answer"
                                    ></GlowButton>
                                </div>
                                {/* show answers button */}
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
                            </div>
                        )}

                        {showAnswersLocally && (
                            <>
                                {/* answer analysis*/}
                                <div
                                    className={
                                        style.questionModal__verticalProperty
                                    }
                                >
                                    <label
                                        className={style.questionModal__label}
                                    >
                                        Analyzed Answer:
                                    </label>
                                    <div
                                        className={style.questionModal__textBox}
                                    >
                                        {newAnalyzedAnswer}
                                    </div>
                                </div>
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
                        handleOnClick={handleSaveClicked}
                    ></GlowButton>
                </Modal.Footer>
            </Modal>
            <ConfirmOverrideDialog />
        </div>
    );
};

export default QuestionModal;
