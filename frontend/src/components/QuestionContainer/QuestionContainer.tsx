import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./QuestionContainer.css";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import CodeEditor from "../CodeEditor/CodeEditor";
import { Category, Difficulty, Type } from "../../enumOptions";
import ReactMarkdown from "react-markdown";

interface Props {
  title: string;
  question: string;
  answer: string;
  questionCategory: Category;
  questionDifficulty: Difficulty;
  questionType: Type;
}

const QuestionContainer = ({
  title,
  question,
  answer,
  questionCategory,
  questionDifficulty,
  questionType,
}: Props) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const [formattedQuestion, setFormattedQuestion] = useState("");
  const [formattedAnswer, setFormattedAnswer] = useState("");

  useEffect(() => {
    setUserAnswer("");
    setShowAnswer(false);

    let correctNewLineQuestion = question;
    if (answer.includes("\r\n")) {
      correctNewLineQuestion = question.replace(/\r?\n/g, "  \n");
    } else if (question.includes("\n")) {
      correctNewLineQuestion = question.replace(/\n/g, "  \n");
    } else if (question.includes("\\n")) {
      correctNewLineQuestion = question.replace(/\\n/g, "  \n");
    }
    setFormattedQuestion(`\`\`\`  \n${correctNewLineQuestion}  \n \`\`\``);

    let correctNewLineAnswer = answer;
    if (answer.includes("\r\n")) {
      correctNewLineAnswer = answer.replace(/\r?\n/g, "  \n");
    } else if (answer.includes("\n")) {
      correctNewLineAnswer = answer.replace(/\n/g, "  \n");
    } else if (answer.includes("\\n")) {
      correctNewLineAnswer = answer.replace(/\\n/g, "  \n");
    }
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
    <Container fluid>
      <div>
        <h1 className="questionHeader defaultMargins">{title}</h1>
        <pre className="display-linebreak defaultLRPadding" id="questionText">
          {formattedQuestion}
        </pre>
      </div>

      <div className="defaultMargins">
        {questionType === Type.Coding ? (
          <div>
            <h4>Your Answer: {questionCategory} Coding Editor</h4>
            <CodeEditor
              questionCategory={questionCategory}
              answerText={userAnswer}
            ></CodeEditor>
          </div>
        ) : (
          <Form.Group>
            <Form.Label className="text-sm-right" id="yourAnswerLabel">
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

        <Button
          variant="light"
          size="lg"
          id="showAnswerButton"
          onClick={handleShowAnswerClicked}
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </Button>
      </div>

      {showAnswer && (
        <div className="border defaultMargins">
          <h1 className="answerHeader defaultMargins">Answer</h1>
          <pre className="display-linebreak defaultLRPadding" id="answerText">
            {/* {formattedAnswer} */}
            <ReactMarkdown>{formattedAnswer}</ReactMarkdown>
          </pre>
        </div>
      )}
    </Container>
  );
};

export default QuestionContainer;
