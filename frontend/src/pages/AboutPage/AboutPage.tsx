import style from "./AboutPage.module.css";
import Header from "../../components/Header/Header";
import { useAuth } from "../../context/authContext";
import NavigationBar from "../../components/Navigation/NavigationBar";
import owlIcon from "../../assets/owlIcon.png";

const AboutPage = () => {
    const auth = useAuth();

    const aboutText =
        "This website is a personal project. I was inspired by Duolingo, which is an app that \
        helps users study a new language by practicing a little everyday. So, I created CodeLingo, \
        where it is easy to practice different types of coding interview questions daily. \
        It was created using a Python Flask Rest API and a React Typescript frontend and uses the \
        OpenAI API to generate the questions and answers.";

    const contactText =
        "If you have any comments or notice any bugs, please reach out to codelingo.help@gmail.com.";
    return (
        <div>
            <NavigationBar
                loggedIn={auth.loggedIn}
                onUserPage={true}
            ></NavigationBar>
            <div className={style.about__container}>
                <div className={style.about__headerBackground}>
                    <Header title="About" defaultBackground={true}></Header>
                </div>
                <div className={style.about__contentContainer}>
                    <img src={owlIcon} className={style.about__owlIcon}></img>
                    <p className={style.about__text}>
                        {aboutText} <br /> <br />
                        {contactText}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
