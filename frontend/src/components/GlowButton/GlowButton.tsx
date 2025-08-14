import { Button } from "react-bootstrap";
import style from "./GlowButton.module.css";

interface Props {
    text: string;
    handleOnClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
            type="button"
            className={style.glowButton}
            variant="light"
            size="lg"
            onClick={handleOnClick}
        >
            <div className={style.glowButton__contentContainer}>
                {loading && (
                    <div
                        className={`spinner-border spinner-border-sm spinner ${style.glowButton__loadSpinner} `}
                        role="status"
                    ></div>
                )}
                {loading ? loadingText : text}
            </div>
        </Button>
    );
};

export default GlowButton;
