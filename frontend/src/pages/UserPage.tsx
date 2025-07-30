import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../services/apiClient";
import Profile from "../components/Profile/Profile";
import SavedQuestions from "../components/SavedQuestions/SavedQuestions";
import ISavedQuestion from "../components/ISavedQuestion";

const UserPage = () => {
    const params = useParams();
    const username = params.username ?? "";

    const [savedQuestions, setSavedQuestions] = useState<ISavedQuestion[]>([]);

    const getUserData = async () => {
        try {
            const response = await apiClient.get(`/users/${username}`);
            if (response.status === 200) {
                let data = response.data;
                setSavedQuestions(data.savedQuestions);
            }
        } catch (e) {
            console.log((e as Error).message);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div>
            <h1>Hello {username}</h1>
            <Profile user={username}></Profile>
            <SavedQuestions savedQuestions={savedQuestions}></SavedQuestions>
        </div>
    );
};
export default UserPage;
