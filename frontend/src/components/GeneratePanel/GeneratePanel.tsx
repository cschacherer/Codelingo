import Button from "react-bootstrap/Button";
import Dropdown from "../Dropdown/Dropdown";
import IQuestionOptions from "../IQuestionOptions";
import "./GeneratePanel.css";
import { useState, useEffect } from "react";
import { Category, Difficulty, Type } from "../../enumOptions";

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

  // useEffect(() => {
  //   if (options.categoryOptions.length >= 1) {
  //     setSelectedCategory(options.categoryOptions[0]);
  //   }
  //   if (options.difficultyOptions.length >= 1) {
  //     setSelectedDifficulty(options.difficultyOptions[0]);
  //   }
  //   if (options.typeOptions.length >= 1) {
  //     setSelectedType(options.typeOptions[0]);
  //   }
  // }, []);

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
          handleOnClick(selectedCategory, selectedDifficulty, selectedType)
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
