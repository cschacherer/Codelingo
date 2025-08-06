import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
// import LoginPage from "./pages/LoginPages/LoginPage";
//import RegisterPage from "./pages/LoginPages/RegisterPage";
import UserPage from "./pages/UserPage/UserPage";
import { AuthProvider } from "./context/authContext";
import SavedQuestionsPage from "./pages/SavedQuestionsPage/SavedQuestionsPage";
//import ResetPasswordPage from "./pages/LoginPages/ResetPasswordPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import RequestPasswordResetPage from "./pages/RequestPasswordResetPage/RequestPasswordResetPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/user" element={<UserPage />} />
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
                        element={<ResetPasswordPage />}
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
