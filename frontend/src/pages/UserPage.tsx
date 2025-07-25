import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../services/apiClient";

const UserPage = () => {
    const { username } = useParams();

    const [userData, setUserData] = useState("");

    const getUserData = async () => {
        try {
            const response = await apiClient.get(`/users/${username}`);
            if (response.status === 200) {
                let data = response.data;
                setUserData(data);
            }
        } catch (e) {
            console.log((e as Error).message);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <>
            <h1>Hello {username}</h1>
            <p>{userData ? JSON.stringify(userData) : "Loading..."}</p>{" "}
        </>
    );
};
export default UserPage;
