import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/utils";
import { useAuth } from "../../context/authContext";
import sharedStyle from "../../Forms.module.css";
import style from "./RegisterPage.module.css";
import PasswordInput from "../../components/PasswordInput/PasswordInput";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    const register = async () => {
        try {
            await auth.registerUser(username, password, email);
            navigate("/");
        } catch (err) {
            let msg = getErrorMessage(err);
            setError(`Error registering user. ${msg}`);
        }
    };

    return (
        <div className={sharedStyle.form__body}>
            <div className={sharedStyle.form__container}>
                <div className={sharedStyle.form__title}>Register Form</div>
                <form
                    className={sharedStyle.form__form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        register();
                    }}
                >
                    <div className={sharedStyle.form__inputField}>
                        <input
                            className={`${sharedStyle.form__inputField__input} ${sharedStyle.form__inputFieldText}`}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label className={sharedStyle.form__inputFieldLabel}>
                            Username
                        </label>
                    </div>
                    <PasswordInput
                        password={password}
                        passwordLabel="Password"
                        updatePasswordFunction={(e) =>
                            setPassword(e.target.value)
                        }
                    ></PasswordInput>
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
                        />
                        <label className={sharedStyle.form__inputFieldLabel}>
                            Email (Optional)
                        </label>
                    </div>
                    <div className={sharedStyle.form__inputField}>
                        <input
                            className={`${sharedStyle.form__inputField__input} ${sharedStyle.form__submitButton}`}
                            type="submit"
                            value="Register"
                        />
                    </div>
                    {error && (
                        <div className={sharedStyle.form__error}>
                            <p>{error}</p>
                        </div>
                    )}
                    <div className={style.registerForm__loginContent}>
                        Already a member?{" "}
                        <a className={sharedStyle.form__link} href="/login">
                            Login now
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
