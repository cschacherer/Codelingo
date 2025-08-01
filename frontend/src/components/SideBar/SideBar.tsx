import "./SideBar.css";
import GeneratePanel from "../GeneratePanel/GeneratePanel";
import IQuestionOptions from "../IQuestionOptions";
import { Category, Difficulty, Type } from "../../utils/enumOptions";

interface Props {
    name: string;
    icon: string;
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

const SideBar = ({
    name,
    icon,
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
        <div className="container sideBarBackground">
            <div className="container verticalFlex" id="mainGroup">
                <h1>
                    <a href="/" id="titleText">
                        {name}
                    </a>
                </h1>
                <img className="icon iconSize" src={icon} />
                <GeneratePanel
                    options={options}
                    selectedCategory={selectedCategory}
                    selectedDifficulty={selectedDifficulty}
                    selectedType={selectedType}
                    handleCategoryChange={handleCategoryChange}
                    handleDifficultyChange={handleDifficultyChange}
                    hanldeTypeChange={hanldeTypeChange}
                    handleOnClick={handleOnClick}
                    loading={loading}
                ></GeneratePanel>
            </div>
        </div>
    );
};

export default SideBar;
