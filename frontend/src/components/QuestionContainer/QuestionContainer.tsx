import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import style from "./QuestionContainer.module.css";
import { useState, useEffect } from "react";
import CodeEditor from "../CodeEditor/CodeEditor";
import ReactMarkdown from "react-markdown";
import { Category } from "../../models/Category";
import { Difficulty } from "../../models/Difficulty";
import { Type } from "../../models/Type";

interface Props {
    question: string;
    answer: string;
    questionCategory: Category;
    questionDifficulty: Difficulty;
    questionType: Type;
    handleSaveQuestion: (
        formattedQuestion: string,
        formattedAnswer: string,
        userAnswer: string
    ) => void;
    isSaved: boolean;
}

const QuestionContainer = ({
    question,
    answer,
    questionCategory,
    questionDifficulty,
    questionType,
    handleSaveQuestion,
    isSaved,
}: Props) => {
    const [userAnswer, setUserAnswer] = useState("");
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
        setUserAnswer("");
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

    const handleUserAnswerChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setUserAnswer(event.target.value);
    };

    const handleUserAnswerChangeCode = (newValue: string) => {
        setUserAnswer(newValue);
    };

    return (
        <div className={style.questionContainer}>
            <div className={style.questionContainer__background}>
                <div className={style.questionContainer__questionContainer}>
                    <h1 className={style.questionContainer__questionHeader}>
                        Question
                    </h1>
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
                                    handleUserAnswerChangeCode
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
                                onChange={handleUserAnswerChange}
                                value={userAnswer}
                            ></Form.Control>
                        </Form.Group>
                    )}
                    <div className={style.questionContainer__buttonContainer}>
                        <button
                            className={style.questionContainer__glowButton}
                            onClick={handleShowAnswerClicked}
                        >
                            {showAnswer ? "Hide Answer" : "Show Answer"}
                        </button>

                        <Button
                            className={style.questionContainer__glowButton}
                            variant="light"
                            size="lg"
                            onClick={() =>
                                handleSaveQuestion(
                                    formattedQuestion,
                                    formattedAnswer,
                                    userAnswer
                                )
                            }
                        >
                            {isSaved ? "Saved Question" : "Save Question"}
                        </Button>
                    </div>
                </div>

                {showAnswer && (
                    <div className={style.questionContainer__answerContainer}>
                        <h1 className={style.questionContainer__answerHeader}>
                            Answer
                        </h1>
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
