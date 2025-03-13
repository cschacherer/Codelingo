import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import "./QuestionContainer.css";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

interface Props {
  title: string;
  question: string;
  answer: string;
}

const QuestionContainer = ({ title, question, answer }: Props) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setUserAnswer("");
    setShowAnswer(false);
  }, [question]);

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
        <pre className="defaultLRPadding" id="questionText">
          {question}
        </pre>
      </div>

      <div className="defaultMargins">
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
          <pre className="defaultLRPadding" id="answerText">
            {answer}
          </pre>
        </div>
      )}
    </Container>
  );
};

export default QuestionContainer;
