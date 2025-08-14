import GeneratePanel from "../GeneratePanel/GeneratePanel";
import { Container } from "react-bootstrap";
import style from "./SideBar.module.css";
import { QuestionOptions } from "../../models/QuestionOptions";
import { Category } from "../../models/Category";
import { Difficulty } from "../../models/Difficulty";
import { Type } from "../../models/Type";
import icon from "../../assets/owlIcon.png";

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

const SideBar = ({
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
    return (
        <Container className={style.sideBar__background}>
            <div className={style.sideBar__container}>
                <h1>
                    <a className={style.sideBar__title} href="/">
                        CodeLingo
                    </a>
                </h1>
                <label className={style.sideBar__subTitle}>
                    Use AI to test your coding skills
                </label>
                <a href="/">
                    <img className={style.sideBar__image} src={icon} />
                </a>

                <GeneratePanel
                    options={options}
                    selectedCategory={selectedCategory}
                    customCategory={customCategory}
                    selectedDifficulty={selectedDifficulty}
                    selectedType={selectedType}
                    handleCategoryChange={handleCategoryChange}
                    handleCustomCategoryChange={handleCustomCategoryChange}
                    handleDifficultyChange={handleDifficultyChange}
                    handleTypeChange={handleTypeChange}
                    handleOnClick={handleOnClick}
                    loading={loading}
                ></GeneratePanel>
            </div>
        </Container>
    );
};

export default SideBar;
