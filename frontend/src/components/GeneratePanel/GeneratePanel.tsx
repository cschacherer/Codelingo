import Button from "react-bootstrap/Button";
import Dropdown from "../Dropdown/Dropdown";
import IQuestionOptions from "../IQuestionOptions";
import "./GeneratePanel.css";
import { useState, useEffect } from "react";
import { Category, Difficulty, Type } from "../../utils/enumOptions";

interface Props {
    options: IQuestionOptions;
    handleOnClick: (category: string, difficulty: string, type: string) => void;
    loading: boolean;
}

const GeneratePanel = ({ options, handleOnClick, loading }: Props) => {
    const [selectedCategory, setSelectedCategory] = useState(
        Category.Python.toString()
    );
    const [selectedDifficulty, setSelectedDifficulty] = useState(
        Difficulty.Easy.toString()
    );
    const [selectedType, setSelectedType] = useState(Type.Coding.toString());

    return (
        <div className="container verticalFlex">
            <Dropdown
                title={options.categoryLabel}
                items={options.categoryOptions}
                selectedItem={selectedCategory}
                changeSelectedItem={setSelectedCategory}
            ></Dropdown>
            <Dropdown
                title={options.difficultyLabel}
                items={options.difficultyOptions}
                selectedItem={selectedDifficulty}
                changeSelectedItem={setSelectedDifficulty}
            ></Dropdown>
            <Dropdown
                title={options.typeLabel}
                items={options.typeOptions}
                selectedItem={selectedType}
                changeSelectedItem={setSelectedType}
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
