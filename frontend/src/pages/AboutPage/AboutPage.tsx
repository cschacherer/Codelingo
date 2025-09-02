import style from "./AboutPage.module.css";
import Header from "../../components/Header/Header";
import { useAuth } from "../../context/authContext";
import NavigationBar from "../../components/Navigation/NavigationBar";
import owlIcon from "../../assets/owlIcon.png";
import loginPic from "../../assets/login.png";
import registerPic from "../../assets/register.png";
import resetPasswordPic from "../../assets/resetPassword.png";
import profilePic from "../../assets/profile.png";
import savedQuestionsPic from "../../assets/savedQuestions.png";
import savedQuestionsShowAnswerPic from "../../assets/savedQuestions_showAnswer.png";
import questionsVideo from "../../assets/savedQuestionsVid.mp4";

const AboutPage = () => {
    const auth = useAuth();

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
                        CodeLingo is a personal project inspired by Duolingo’s
                        approach to daily learning. The application provides an
                        accessible platform for practicing diverse coding
                        questions on a regular basis.
                        <br /> <br />
                        If you have any comments or notice any bugs, please
                        reach out to codelingo.help@gmail.com.
                        <br /> <br />
                        <b>Development: </b>This project features a Python Flask
                        REST API backend, a React TypeScript frontend, and
                        integrates the OpenAI API to dynamically generate
                        questions and evaluate solutions.
                        <br /> <br />
                        <b>AWS: </b>This project is fully deployed on AWS,
                        utilizing PostgreSQL (RDS) for persistent data storage,
                        Elastic Beanstalk for API hosting, and CloudFront/S3 for
                        frontend distribution.
                    </p>
                </div>
            </div>
            <div className={style.about__container}>
                <div className={style.about__headerBackground}>
                    <Header title="Features" defaultBackground={true}></Header>
                </div>
                <div className={style.about__featuresContainer}>
                    <label className={style.about__featuresLabel}>
                        Account Management:
                    </label>
                    <p className={style.about__featuresText}>
                        Implemented full account management, so users can create
                        an account, login, modify account data, or recover a
                        password.
                    </p>
                    <div className={style.about__imgContainer}>
                        <img className={style.about__picture} src={loginPic} />
                        <img
                            className={style.about__picture}
                            src={registerPic}
                        />
                        <img
                            className={style.about__picture}
                            src={resetPasswordPic}
                        />
                        <img
                            className={style.about__longPicture}
                            src={profilePic}
                        />
                    </div>

                    <br></br>
                    <label className={style.about__featuresLabel}>
                        Save Questions to Your Account:
                    </label>
                    <p className={style.about__featuresText}>
                        Users can save questions to their account to review at a
                        later date or retry answering their saved questions.
                    </p>
                    <div className={style.about__imgContainer}>
                        <img
                            className={style.about__longPicture}
                            src={savedQuestionsPic}
                        />
                        <img
                            className={style.about__longPicture}
                            src={savedQuestionsShowAnswerPic}
                        />
                        <video controls className={style.about__longPicture}>
                            <source
                                src={questionsVideo}
                                type="video/mp4"
                            ></source>
                        </video>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
