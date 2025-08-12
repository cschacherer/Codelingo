import { useEffect, useState } from "react";
import { getUser } from "../../services/userService";
import style from "./ProfilePage.module.css";
import NavigationBar from "../../components/Navigation/NavigationBar";
import { useAuth } from "../../context/authContext";
import userAvatar from "../../assets/user.png";
import Header from "../../components/Header/Header";

const ProfilePage = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const auth = useAuth();

    const getUserData = async () => {
        try {
            const response = await getUser();
            console.log(response);
            setUsername(response.username);
            setEmail(response.email);
        } catch (e) {
            console.log((e as Error).message);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div className={style.profilePage}>
            <NavigationBar
                loggedIn={auth.loggedIn}
                onUserPage={true}
            ></NavigationBar>
            <div className={style.profile__container}>
                <Header title="Profile" defaultBackground={true}></Header>
                <div className={style.profile__avatarUsernameContainer}>
                    <img
                        className={style.profile__avatar}
                        src={userAvatar}
                    ></img>
                    <div className={style.profile__data}>
                        <div className={style.profile__dataItem}>
                            <label className={style.profile__label}>
                                Username:
                            </label>
                            {username}
                        </div>
                        <div className={style.profile__dataItem}>
                            <label className={style.profile__label}>
                                Email:
                            </label>
                            {email}
                        </div>
                        <div className={style.profile__dataItem}>
                            <label className={style.profile__label}>
                                Password:
                            </label>
                            <a href="/password/change">Change Password</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProfilePage;
