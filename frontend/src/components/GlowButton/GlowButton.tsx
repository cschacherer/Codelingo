import { Button } from "react-bootstrap";
import style from "./GlowButton.module.css";

interface Props {
    text: string;
    handleOnClick: () => void;
    loading?: boolean;
    loadingText?: string;
}

const GlowButton = ({
    text,
    handleOnClick,
    loading = false,
    loadingText = "",
}: Props) => {
    return (
        <Button
            className={style.glowButton}
            variant="light"
            size="lg"
            onClick={handleOnClick}
        >
            {loading && (
                <div
                    className={`spinner-border spinner-border-sm ${style.glowButton__loadSpinner} `}
                    role="status"
                ></div>
            )}
            {loading ? loadingText : text}
        </Button>
    );
};

export default GlowButton;
