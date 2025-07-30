import axios from "axios";
import "./css/LoginAndRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import { getErrorMessage } from "../helpers/utils";

const LoginPage = () => {
    const [usernameText, setUsernameText] = useState("admin");
    const [passwordText, setPasswordText] = useState("admin123");
    const [errorText, setErrorText] = useState("");

    const navigate = useNavigate();

    const sendLoginCredentials = async () => {
        const jsonLogin = {
            username: usernameText,
            password: passwordText,
        };

        try {
            const response = await apiClient.post("/login", jsonLogin);
            if (response.status === 200) {
                navigate(`/users/${usernameText}`);
            } else if (response.status === 401) {
                setErrorText("You're username or password were incorrect.");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setErrorText("You're username or password were incorrect.");
            } else {
                let msg = getErrorMessage(error);
                setErrorText(`Error logging in. ${msg}`);
            }
            setUsernameText("");
            setPasswordText("");
        }
    };

    return (
        <div className="wrapper">
            <div className="title">Login Form</div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendLoginCredentials();
                }}
            >
                <div className="field">
                    <input
                        type="text"
                        value={usernameText}
                        onChange={(e) => setUsernameText(e.target.value)}
                        required
                    />
                    <label>Username</label>
                </div>
                <div className="field">
                    <input
                        type="password"
                        value={passwordText}
                        onChange={(e) => setPasswordText(e.target.value)}
                        required
                    />
                    <label>Password</label>
                </div>
                <div className="content">
                    <div className="checkbox">
                        <input type="checkbox" id="remember-me" />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <div className="pass-link">
                        <a href="/forgotpassword">Forgot password?</a>
                    </div>
                </div>
                <div className="field">
                    <input type="submit" value="Login" />
                </div>
                {errorText !== "" && (
                    <div className="error">
                        <p>{errorText}</p>
                    </div>
                )}

                <div className="signup-link">
                    Not a member? <a href="/register">Sign up now</a>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
