import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/utils";
import { useAuth } from "../../context/authContext";
import { patchUser } from "../../services/userService";
import ChangePassword from "../../components/ChangePassword/ChangePassword";
import sharedStyle from "../../Forms.module.css";

const ChangePasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    const changeUserPassword = async () => {
        try {
            if (newPassword !== confirmPassword) {
                setError("Passwords must match");
                return;
            }
            //don't let user change their password if they are not logged in
            if (!auth.loggedIn) {
                navigate("/");
                return;
            }
            const response = await patchUser("", newPassword, "");
            if (response) {
                navigate("/users");
            }
        } catch (err) {
            let msg = getErrorMessage(err);
            setError(msg);
        }
    };

    const updateNewPassword = (value: string) => {
        setNewPassword(value);
    };

    const updateConfirmPassword = (value: string) => {
        setConfirmPassword(value);
    };

    return (
        <div className="changePasswordPage">
            <ChangePassword
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                updateNewPassword={updateNewPassword}
                updateConfirmPassword={updateConfirmPassword}
                buttonText="Change Password"
                handleSubmitFunction={changeUserPassword}
            ></ChangePassword>
            {error && (
                <div className={sharedStyle.form__error}>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default ChangePasswordPage;
