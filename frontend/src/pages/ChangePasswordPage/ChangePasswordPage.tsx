import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../utils/utils";
import { useAuth } from "../../context/authContext";
import { patchUser } from "../../services/userService";
import sharedStyle from "../../Forms.module.css";
import { resetPassword } from "../../services/authService";

const ChangePasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    let { token } = useParams<string>();
    if (!token) {
        token = "";
    }

    const validatePasswords = () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords must match");
            return false;
        }
        return true;
    };

    //handle changing the user password from thier profile page
    const changeUserPassword = async () => {
        try {
            if (!validatePasswords()) {
                return;
            }
            //don't let user change their password if they are not logged in
            if (!auth.loggedIn) {
                navigate("/");
                return;
            }
            const response = await patchUser("", newPassword, "");
            if (response) {
                navigate("/user");
            }
        } catch (err) {
            let msg = getErrorMessage(err);
            setError(msg);
        }
    };

    //handle resetting the user's password from an email reset link
    const resetUserPassword = async () => {
        try {
            if (!validatePasswords()) {
                return;
            }
            if (auth.loggedIn) {
                navigate("/user");
            }

            const response = await resetPassword(token, newPassword);
            setSuccessMessage(
                `${response.message}. \n \n Redirecting you back to the login page...`
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

    //set up whether the page is for changing the user's password or resetting it from an email
    const location = useLocation();
    const pageUrl = location.pathname;
    let handleSubmitFunction: () => Promise<void>;
    let formText = "";

    if (pageUrl.startsWith("/password/reset")) {
        handleSubmitFunction = resetUserPassword;
        formText = "Reset Password";
    } else if (pageUrl.startsWith("/password/change")) {
        handleSubmitFunction = changeUserPassword;
        formText = "Change Password";
    }

    return (
        <div className={sharedStyle.form__body}>
            <div className={sharedStyle.form__body}>
                <div className={sharedStyle.form__container}>
                    <div className={sharedStyle.form__title}>{formText}</div>
                    <form
                        className={sharedStyle.form__form}
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitFunction();
                        }}
                    >
                        <div className={sharedStyle.form__inputField}>
                            <input
                                className={`${sharedStyle.form__inputField__input} ${sharedStyle.form__inputFieldPassword}`}
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <label
                                className={sharedStyle.form__inputFieldLabel}
                            >
                                New Password
                            </label>
                        </div>
                        <div className={sharedStyle.form__inputField}>
                            <input
                                className={`${sharedStyle.form__inputField__input} ${sharedStyle.form__inputFieldPassword}`}
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                            <label
                                className={sharedStyle.form__inputFieldLabel}
                            >
                                Confirm New Password
                            </label>
                        </div>
                        <div className={sharedStyle.form__inputField}>
                            <input
                                className={`${sharedStyle.form__inputField__input} ${sharedStyle.form__submitButton}`}
                                type="submit"
                                value={formText}
                            />
                        </div>
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
