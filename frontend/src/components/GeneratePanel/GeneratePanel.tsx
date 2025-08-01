import Button from "react-bootstrap/Button";
import Dropdown from "../Dropdown/Dropdown";
import IQuestionOptions from "../IQuestionOptions";
import "./GeneratePanel.css";
import { useState, useEffect } from "react";
import { Category, Difficulty, Type } from "../../utils/enumOptions";

interface Props {
    options: IQuestionOptions;
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
        <div className="container verticalFlex">
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
                className="buttonMargins"
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
                        className="spinner-border spinner-border-sm mr-5"
                        role="status"
                    ></div>
                )}
                {loading ? "Generating Question" : "Generate Question"}
            </Button>
        </div>
    );
};

export default GeneratePanel;
