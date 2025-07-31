import "./Profile.css";
import icon from "../../assets/react.svg";

interface Props {
    user: string;
    email: string;
    // profilePic: string;
}

const Profile = ({ user, email }: Props) => {
    return (
        <div className="profile">
            <div className="container">
                <div className="title gridItem">Profile</div>
                <img className="avatar gridItem" src={icon}></img>
                <div className="profileData gridItem">
                    <div className="userData">
                        <b>Username: </b>
                        {user}
                    </div>
                    <div className="userData">
                        <b>Email: </b>
                        {email}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
