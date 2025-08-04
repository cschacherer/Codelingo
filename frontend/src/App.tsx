import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/LoginPage/RegisterPage";
import UserPage from "./pages/UserPage/UserPage";
import { AuthProvider } from "./context/authContext";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/user" element={<UserPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
