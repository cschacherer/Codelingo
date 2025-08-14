import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import style from "./QuestionContainer.module.css";
import { useState, useEffect } from "react";
import CodeEditor from "../CodeEditor/CodeEditor";
import ReactMarkdown from "react-markdown";
import { Category } from "../../models/Category";
import { Difficulty } from "../../models/Difficulty";
import { Type } from "../../models/Type";
import Header from "../Header/Header";
import GlowButton from "../GlowButton/GlowButton";

interface Props {
    question: string;
    answer: string;
    questionCategory: Category;
    questionDifficulty: Difficulty;
    questionType: Type;
    handleSaveQuestion: (
        formattedQuestion: string,
        formattedAnswer: string
    ) => void;
    isSaved: boolean;
    userAnswer: string;
    handleUserAnswerChanged: (newValue: string) => void;
    analyzedAnswer: string;
    handleAnalyzeAnswer: () => void;
    isLoading: boolean;
}

const QuestionContainer = ({
    question,
    answer,
    questionCategory,
    questionDifficulty,
    questionType,
    handleSaveQuestion,
    isSaved,
    userAnswer,
    handleUserAnswerChanged,
    analyzedAnswer,
    handleAnalyzeAnswer,
    isLoading,
}: Props) => {
    const [showAnswer, setShowAnswer] = useState(false);

    const [formattedQuestion, setFormattedQuestion] = useState("");
    const [formattedAnswer, setFormattedAnswer] = useState("");

    //change any line breaks to "  \n" so ReactMarkdown will read them as a line break
    function replaceNewLine(statement: string) {
        let correctNewLineStatement = statement;
        if (statement.includes("\r\n")) {
            correctNewLineStatement = statement.replace(/\r?\n/g, "  \n");
        } else if (statement.includes("\n")) {
            correctNewLineStatement = statement.replace(/\n/g, "  \n");
        } else if (statement.includes("\\n")) {
            correctNewLineStatement = statement.replace(/\\n/g, "  \n");
        }
        return correctNewLineStatement;
    }

    useEffect(() => {
        setShowAnswer(false);

        let correctNewLineQuestion = replaceNewLine(question);
        setFormattedQuestion(correctNewLineQuestion);

        let correctNewLineAnswer = replaceNewLine(answer);
        ///the ``` will render the answer in code in ReactMarkdown
        if (questionType == Type.Coding) {
            setFormattedAnswer(`\`\`\`  \n${correctNewLineAnswer}  \n \`\`\``);
        } else {
            setFormattedAnswer(correctNewLineAnswer);
        }
    }, [question, answer]);

    const handleShowAnswerClicked = () => {
        setShowAnswer(!showAnswer);
    };

    const handleUserAnswerChange__questionContainer = (value: string) => {
        handleUserAnswerChanged(value);
    };

    return (
        <div className={style.questionContainer}>
            <div className={style.questionContainer__background}>
                <div className={style.questionContainer__questionContainer}>
                    <Header title="Question" defaultBackground={false}></Header>
                    <div className={style.questionContainer__text}>
                        <ReactMarkdown>{formattedQuestion}</ReactMarkdown>
                    </div>
                </div>

                <div className={style.questionContainer__userAnswerContainer}>
                    {questionType === Type.Coding ? (
                        <div>
                            <label
                                className={
                                    style.questionContainer__userAnswerLabel
                                }
                            >
                                Your Answer: {questionCategory} Coding Editor
                            </label>

                            <CodeEditor
                                questionCategory={questionCategory}
                                userAnswer={userAnswer}
                                handleUserAnswerChanged={
                                    handleUserAnswerChange__questionContainer
                                }
                            ></CodeEditor>
                        </div>
                    ) : (
                        <Form.Group>
                            <Form.Label
                                className={
                                    style.questionContainer__userAnswerLabel
                                }
                            >
                                Your answer
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={8}
                                onChange={(e) => {
                                    handleUserAnswerChange__questionContainer(
                                        e.target.value
                                    );
                                }}
                                value={userAnswer}
                            ></Form.Control>
                        </Form.Group>
                    )}
                    <div className={style.questionContainer__buttonContainer}>
                        <div
                            className={
                                style.questionContainer__answerButtonContainer
                            }
                        >
                            <GlowButton
                                text={"Analyze Answer"}
                                handleOnClick={handleAnalyzeAnswer}
                                loadingText="Analyzing Answer"
                                loading={isLoading}
                            ></GlowButton>

                            <GlowButton
                                text={
                                    showAnswer ? "Hide Answer" : "Show Answer"
                                }
                                handleOnClick={handleShowAnswerClicked}
                            ></GlowButton>
                        </div>
                        <GlowButton
                            text={isSaved ? "Saved Question" : "Save Question"}
                            handleOnClick={() =>
                                handleSaveQuestion(
                                    formattedQuestion,
                                    formattedAnswer
                                )
                            }
                        ></GlowButton>
                    </div>
                </div>
                {analyzedAnswer && (
                    <>
                        <div
                            className={
                                style.questionContainer__analyzedAnswerContainer
                            }
                        >
                            <Header
                                title="Answer Analysis"
                                defaultBackground={false}
                            ></Header>
                            <div className={style.questionContainer__text}>
                                <p>{analyzedAnswer}</p>
                            </div>
                        </div>
                        <div
                            className={
                                style.questionContainer__analyzeAnswerMargin
                            }
                        ></div>
                    </>
                )}

                {showAnswer && (
                    <div className={style.questionContainer__answerContainer}>
                        <Header
                            title="Answer"
                            defaultBackground={false}
                        ></Header>
                        <div className={style.questionContainer__text}>
                            <ReactMarkdown>{formattedAnswer}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionContainer;
