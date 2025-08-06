import Button from "react-bootstrap/Button";
import Dropdown from "../Dropdown/Dropdown";
import Container from "react-bootstrap/Container";
import style from "./GeneratePanel.module.css";
import { Category, Difficulty, Type } from "../../utils/enumOptions";
import { QuestionOptions } from "../../models/questions";

interface Props {
    options: QuestionOptions;
    selectedCategory: Category;
    selectedDifficulty: Difficulty;
    selectedType: Type;
    handleCategoryChange: (newValue: Category) => void;
    handleDifficultyChange: (newValue: Difficulty) => void;
    hanldeTypeChange: (newValue: Type) => void;
    handleOnClick: (
        category: Category,
        difficulty: Difficulty,
        type: Type
    ) => void;
    loading: boolean;
}

const GeneratePanel = ({
    options,
    selectedCategory,
    selectedDifficulty,
    selectedType,
    handleCategoryChange,
    handleDifficultyChange,
    hanldeTypeChange,
    handleOnClick,
    loading,
}: Props) => {
    return (
        <Container className={`${style.generatePanel__container}`}>
            <Dropdown
                title={options.categoryLabel}
                items={options.categoryOptions}
                selectedItem={selectedCategory}
                changeSelectedItem={handleCategoryChange}
            ></Dropdown>
            <Dropdown
                title={options.difficultyLabel}
                items={options.difficultyOptions}
                selectedItem={selectedDifficulty}
                changeSelectedItem={handleDifficultyChange}
            ></Dropdown>
            <Dropdown
                title={options.typeLabel}
                items={options.typeOptions}
                selectedItem={selectedType}
                changeSelectedItem={hanldeTypeChange}
            ></Dropdown>

            <Button
                variant="outline-light"
                size="lg"
                className={`${style.generatePanel__button}`}
                onClick={() =>
                    handleOnClick(
                        selectedCategory,
                        selectedDifficulty,
                        selectedType
                    )
                }
            >
                {loading && (
                    <div
                        className={`spinner-border spinner-border-sm ${style.generatePanel__loadSpinner} `}
                        role="status"
                    ></div>
                )}
                {loading ? "Generating Question" : "Generate Question"}
            </Button>
        </Container>
    );
};

export default GeneratePanel;
