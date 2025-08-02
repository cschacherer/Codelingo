import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./QuestionContainer.css";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import CodeEditor from "../CodeEditor/CodeEditor";
import { Category, Difficulty, Type } from "../../utils/enumOptions";
import ReactMarkdown from "react-markdown";
import NavigationBar from "../Navigation/NavigationBar";
import { saveQuestion } from "../../services/questionService";
import { getErrorMessage } from "../../utils/utils";

interface Props {
    title: string;
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
    title,
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

    function replaceNewLine(statement: string) {
        let correctNewLineStatement = statement;
        if (answer.includes("\r\n")) {
            correctNewLineStatement = statement.replace(/\r?\n/g, "  \n");
        } else if (question.includes("\n")) {
            correctNewLineStatement = statement.replace(/\n/g, "  \n");
        } else if (question.includes("\\n")) {
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
        setFormattedAnswer(`\`\`\`  \n${correctNewLineAnswer}  \n \`\`\``);
    }, [question, answer]);

    const handleShowAnswerClicked = () => {
        setShowAnswer(!showAnswer);
    };

    const handleUserAnswerChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setUserAnswer(event.target.value);
    };

    return (
        <>
            <Container fluid>
                <div>
                    <h1 className="questionHeader defaultMargins">{title}</h1>
                    <pre className="defaultLRPadding" id="questionText">
                        <ReactMarkdown>{formattedQuestion}</ReactMarkdown>
                    </pre>
                </div>

                <div className="defaultMargins">
                    {questionType === Type.Coding ? (
                        <div>
                            <h4>
                                Your Answer: {questionCategory} Coding Editor
                            </h4>
                            <CodeEditor
                                questionCategory={questionCategory}
                                answerText={userAnswer}
                            ></CodeEditor>
                        </div>
                    ) : (
                        <Form.Group>
                            <Form.Label
                                className="text-sm-right"
                                id="yourAnswerLabel"
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
                    <div className="buttonContainer">
                        <Button
                            variant="light"
                            size="lg"
                            id="showAnswerButton"
                            onClick={handleShowAnswerClicked}
                        >
                            {showAnswer ? "Hide Answer" : "Show Answer"}
                        </Button>

                        <Button
                            variant="light"
                            size="lg"
                            id="saveQuestionButton"
                            onClick={() =>
                                handleSaveQuestion(
                                    formattedQuestion,
                                    formattedAnswer,
                                    userAnswer
                                )
                            }
                            disabled={isSaved}
                        >
                            Save Question
                        </Button>
                    </div>
                </div>

                {showAnswer && (
                    <div className="border defaultMargins">
                        <h1 className="answerHeader defaultMargins">Answer</h1>
                        <pre
                            className="display-linebreak defaultLRPadding"
                            id="answerText"
                        >
                            <ReactMarkdown>{formattedAnswer}</ReactMarkdown>
                        </pre>
                    </div>
                )}
            </Container>
        </>
    );
};

export default QuestionContainer;
