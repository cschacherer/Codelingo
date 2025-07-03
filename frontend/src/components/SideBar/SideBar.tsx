import "./SideBar.css";
import GeneratePanel from "../GeneratePanel/GeneratePanel";
import IQuestionOptions from "../IQuestionOptions";

interface Props {
  name: string;
  icon: string;
  options: IQuestionOptions;
  handleOnClick: (category: string, difficulty: string, type: string) => void;
  loading: boolean;
}

const SideBar = ({ name, icon, options, handleOnClick, loading }: Props) => {
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
          handleOnClick={handleOnClick}
          loading={loading}
        ></GeneratePanel>
      </div>
    </div>
  );
};

export default SideBar;
