import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/utils";
import { useAuth } from "../../context/authContext";
import sharedStyle from "../../Forms.module.css";
import style from "./LoginPage.module.css";
import PasswordInput from "../../components/PasswordInput/PasswordInput";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    const login = async () => {
        try {
            await auth.loginUser(username, password);
            navigate("/");
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setError("You're username or password were incorrect.");
            } else {
                let msg = getErrorMessage(err);
                setError(`Error logging in. ${msg}`);
            }
            setUsername("");
            setPassword("");
        }
    };

    return (
        <div className={sharedStyle.form__body}>
            <div className={sharedStyle.form__container}>
                <div className={sharedStyle.form__title}>Login Form</div>
                <form
                    className={sharedStyle.form__form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        login();
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
                    <div className={style.loginForm__extraContent}>
                        <div className={style.loginForm__rememberMeCheckBox}>
                            <input
                                className={style.loginForm__rememberMeInput}
                                type="checkbox"
                                id="remember-me"
                            />
                            <label
                                className={style.loginForm__rememberMeLabel}
                                htmlFor="remember-me"
                            >
                                Remember me
                            </label>
                        </div>
                        <div>
                            <a
                                className={sharedStyle.form__link}
                                href="/password/reset/request"
                            >
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    <div className={sharedStyle.form__inputField}>
                        <input
                            className={`${sharedStyle.form__inputField__input} ${sharedStyle.form__submitButton}`}
                            type="submit"
                            value="Login"
                        />
                    </div>
                    {error && (
                        <div className={sharedStyle.form__error}>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className={style.loginForm__signUpContent}>
                        Not a member?{" "}
                        <a className={sharedStyle.form__link} href="/register">
                            Sign up now
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
