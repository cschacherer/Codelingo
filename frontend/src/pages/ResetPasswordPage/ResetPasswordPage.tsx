import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../utils/utils";
import { useAuth } from "../../context/authContext";
import ChangePassword from "../../components/ChangePassword/ChangePassword";
import sharedStyle from "../../Forms.module.css";
import { resetPassword } from "../../services/authService";

const ResetPasswordPage = () => {
    let { token } = useParams<string>();
    if (!token) {
        token = "";
    }

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    const resetUserPassword = async () => {
        try {
            if (newPassword !== confirmPassword) {
                setError("Passwords must match");
                return;
            }
            if (auth.loggedIn) {
                navigate("/user");
            }
            const response = await resetPassword(token, newPassword);
            setSuccessMessage(
                `${response.message}. Redirecting you back to the login page...`
            );
            //so user can see the success message for 5 seconds before being redirected
            await performTimeDelay(5);
            navigate("/login");
        } catch (err) {
            let msg = getErrorMessage(err);
            setError(msg);
        }
    };

    const timeDelay = (milliseconds: number) =>
        new Promise((resolve) => setTimeout(resolve, milliseconds));

    const performTimeDelay = async (seconds: number) => {
        let milliseconds = seconds * 1000;
        await timeDelay(milliseconds);
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
                buttonText="Reset Password"
                handleSubmitFunction={resetUserPassword}
            ></ChangePassword>
            {error && (
                <div className={sharedStyle.form__error}>
                    <p>{error}</p>
                </div>
            )}
            {successMessage && (
                <div className={sharedStyle.form__successMessage}>
                    <p>{successMessage}</p>
                </div>
            )}
        </div>
    );
};

export default ResetPasswordPage;
