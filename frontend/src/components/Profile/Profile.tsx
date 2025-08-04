import style from "./Profile.module.css";
import userAvatar from "../../assets/user.png";

interface Props {
    user: string;
    email: string;
    // profilePic: string;
}

const Profile = ({ user, email }: Props) => {
    return (
        <div className={style.profile__container}>
            <div className={style.profile__title}>Profile</div>
            <div className={style.profile__avatarUsernameContainer}>
                <img className={style.profile__avatar} src={userAvatar}></img>
                <div className={style.profile__data}>
                    <div className={style.profile__dataItem}>
                        <label className={style.profile__label}>
                            Username:
                        </label>
                        {user}
                    </div>
                    <div className={style.profile__dataItem}>
                        <label className={style.profile__label}>Email: </label>
                        {email}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
