import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/LoginAndRegister.css";
import apiClient from "../services/apiClient";
import { getErrorMessage } from "../helpers/utils";

const RegisterPage = () => {
    const [usernameText, setUsernameText] = useState("admin");
    const [passwordText, setPasswordText] = useState("admin123");
    const [emailText, setEmailText] = useState("something@gmail.com");
    const [errorText, setErrorText] = useState("");

    const navigate = useNavigate();

    const registerUser = async () => {
        const registerInfo = {
            username: usernameText,
            password: passwordText,
            email: emailText,
        };

        try {
            const response = await apiClient.post("/register", registerInfo);
            if (response.status == 200) {
                navigate(`users/${usernameText}`);
            } else {
                setErrorText(
                    `Error registering user. ${response.data?.message}`
                );
            }
        } catch (e) {
            let msg = getErrorMessage(e);
            setErrorText(`Error registering user. ${msg}`);
        }
    };

    return (
        <div className="wrapper">
            <div className="title">Register Form</div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    registerUser();
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
                <div className="field">
                    <input
                        type="text"
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                    />
                    <label>Email (Optional)</label>
                </div>
                <div className="field">
                    <input type="submit" value="Register" />
                </div>
                {errorText !== "" && (
                    <div className="error">
                        <p>{errorText}</p>
                    </div>
                )}
                <div className="signup-link">
                    Already a member? <a href="/login">Login now</a>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
