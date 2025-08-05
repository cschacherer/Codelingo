import GeneratePanel from "../GeneratePanel/GeneratePanel";
import IQuestionOptions from "../IQuestionOptions";
import { Category, Difficulty, Type } from "../../utils/enumOptions";
import { Container } from "react-bootstrap";
import style from "./SideBar.module.css";

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
        <Container className={`${style.sideBar__container}`}>
            <h1>
                <a className={style.sideBar__title} href="/">
                    CodeLingo
                </a>
            </h1>
            <a href="/">
                <img className={style.sideBar__image} src={icon} />
            </a>

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
        </Container>
    );
};

export default SideBar;
