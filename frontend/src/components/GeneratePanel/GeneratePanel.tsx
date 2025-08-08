import Button from "react-bootstrap/Button";
import Dropdown from "../Dropdown/Dropdown";
import Container from "react-bootstrap/Container";
import style from "./GeneratePanel.module.css";
import { Category } from "../../models/Category";
import { Difficulty } from "../../models/Difficulty";
import { QuestionOptions } from "../../models/QuestionOptions";
import { Type } from "../../models/Type";
import { useState } from "react";

interface Props {
    options: QuestionOptions;
    selectedCategory: Category;
    customCategory: string;
    selectedDifficulty: Difficulty;
    selectedType: Type;
    handleCategoryChange: (newValue: Category) => void;
    handleCustomCategoryChange: (newValue: string) => void;
    handleDifficultyChange: (newValue: Difficulty) => void;
    handleTypeChange: (newValue: Type) => void;
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
    customCategory,
    selectedDifficulty,
    selectedType,
    handleCategoryChange,
    handleCustomCategoryChange,
    handleDifficultyChange,
    handleTypeChange,
    handleOnClick,
    loading,
}: Props) => {
    const [showCustomCategory, setShowCustomCategory] = useState(false);

    //if the Category dropdown changes to custom, show the custom text box
    const handleCategoryChange_generatePanel = (value: Category) => {
        if (value === Category.Custom) {
            setShowCustomCategory(true);
        } else {
            setShowCustomCategory(false);
        }
        handleCategoryChange(value);
    };

    return (
        <Container className={`${style.generatePanel__container}`}>
            <Dropdown
                title={options.categoryLabel}
                items={options.categoryOptions}
                selectedItem={selectedCategory}
                changeSelectedItem={handleCategoryChange_generatePanel}
                useCustomText={showCustomCategory}
                customText={customCategory}
                onCustomTextChange={handleCustomCategoryChange}
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
                changeSelectedItem={handleTypeChange}
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
