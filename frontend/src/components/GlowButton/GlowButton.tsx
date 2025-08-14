import { Button } from "react-bootstrap";
import style from "./GlowButton.module.css";

interface Props {
    text: string;
    handleOnClick: () => void;
}

const GlowButton = ({ text, handleOnClick }: Props) => {
    return (
        <Button
            className={style.glowButton}
            variant="light"
            size="lg"
            onClick={handleOnClick}
        >
            {text}
        </Button>
    );
};

export default GlowButton;
