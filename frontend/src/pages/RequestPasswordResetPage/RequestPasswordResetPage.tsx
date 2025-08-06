import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/utils";
import { useAuth } from "../../context/authContext";
import { requestPasswordReset } from "../../services/authService";
import sharedStyle from "../../Forms.module.css";
import style from "./RequestPasswordResetPage.module.css";

const RequestPasswordResetPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    const resetPassword = async () => {
        try {
            //don't let user change their password if they are not logged in
            if (auth.loggedIn) {
                navigate("/user");
                return;
            }
            const response = await requestPasswordReset(email);
            setSuccessMessage(response.message);
        } catch (err) {
            let msg = getErrorMessage(err);
            setError(msg);
        }
    };

    return (
        <div className={sharedStyle.form__body}>
            <div className={sharedStyle.form__container}>
                <div className={sharedStyle.form__title}>Reset Password</div>
                <form
                    className={sharedStyle.form__form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        resetPassword();
                    }}
                >
                    <div className={style.requestPasswordReset__text}>
                        Enter your email address below, and we'll send you an
                        email allowing you to reset your password. <br />
                        <br />
                        This will only work if you have added your email to your
                        account.
                    </div>
                    <div className={sharedStyle.form__inputField}>
                        <input
                            className={
                                email
                                    ? `${sharedStyle.form__inputField__input} ${sharedStyle.form__inputFieldEmail__hasContent}`
                                    : `${sharedStyle.form__inputField__input}`
                            }
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label className={sharedStyle.form__inputFieldLabel}>
                            Email
                        </label>
                    </div>

                    <div className={sharedStyle.form__inputField}>
                        <input
                            className={`${sharedStyle.form__inputField__input} ${sharedStyle.form__submitButton}`}
                            type="submit"
                            value="Reset Password"
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
    );
};

export default RequestPasswordResetPage;
