import axios from "axios";
import "./css/LoginAndRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/utils";
import { useAuth } from "../context/authContext";

const LoginPage = () => {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");
    const [error, setError] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    const login = async () => {
        try {
            auth.loginUser(username, password);
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
        <div className="wrapper">
            <div className="title">Login Form</div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    login();
                }}
            >
                <div className="field">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label>Username</label>
                </div>
                <div className="field">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                {error !== "" && (
                    <div className="error">
                        <p>{error}</p>
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
