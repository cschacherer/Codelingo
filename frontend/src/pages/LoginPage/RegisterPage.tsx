import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginAndRegister.css";
import { getErrorMessage } from "../../utils/utils";
import { useAuth } from "../../context/authContext";

const RegisterPage = () => {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");
    const [email, setEmail] = useState("something@gmail.com");
    const [error, setError] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    const register = async () => {
        try {
            auth.registerUser(username, password, email);
            navigate("/");
        } catch (err) {
            let msg = getErrorMessage(err);
            setError(`Error registering user. ${msg}`);
        }
    };

    return (
        <div className="wrapper">
            <div className="title">Register Form</div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    register();
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
                <div className="field">
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Email (Optional)</label>
                </div>
                <div className="field">
                    <input type="submit" value="Register" />
                </div>
                {error !== "" && (
                    <div className="error">
                        <p>{error}</p>
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
