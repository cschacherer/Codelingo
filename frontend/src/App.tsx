import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { AuthProvider } from "./context/authContext";
import SavedQuestionsPage from "./pages/SavedQuestionsPage/SavedQuestionsPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import RequestPasswordResetPage from "./pages/RequestPasswordResetPage/RequestPasswordResetPage";
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage";
import AboutPage from "./pages/AboutPage/AboutPage";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/user" element={<ProfilePage />} />
                    <Route
                        path="/questions/saved"
                        element={<SavedQuestionsPage />}
                    />
                    <Route
                        path="/password/change"
                        element={<ChangePasswordPage />}
                    />
                    <Route
                        path="/password/reset/request"
                        element={<RequestPasswordResetPage />}
                    />
                    <Route
                        path="/password/reset/:token"
                        element={<ChangePasswordPage />}
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
