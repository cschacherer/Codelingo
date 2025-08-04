import { useEffect, useState } from "react";
import Profile from "../../components/Profile/Profile";
import SavedQuestions from "../../components/SavedQuestions/SavedQuestions";
import { getUser } from "../../services/userService";
import { SavedQuestion } from "../../models/questions";
import style from "./UserPage.module.css";
import NavigationBar from "../../components/Navigation/NavigationBar";
import { useAuth } from "../../context/authContext";

const UserPage = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);

    const auth = useAuth();

    const getUserData = async () => {
        try {
            const response = await getUser();
            console.log(response);
            let x = response.username;
            setUsername(response.username);
            setEmail(response.email);
            setSavedQuestions(response.savedQuestions);
        } catch (e) {
            console.log((e as Error).message);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div className={style.userPage}>
            <NavigationBar
                loggedIn={auth.loggedIn}
                onUserPage={true}
            ></NavigationBar>
            <Profile user={username} email={email}></Profile>
            <SavedQuestions savedQuestions={savedQuestions}></SavedQuestions>
        </div>
    );
};
export default UserPage;
