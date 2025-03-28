import { useEffect, useState } from "react";
import userService, { User } from "../services/userService";
import { CanceledError } from "../services/apiClient";

const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    setIsLoading(true);

    const { request, cancelFunction } = userService.getAll<User>();
    request
        .then((res) => {
        setUsers(res.data);
        setIsLoading(false);
        })
        .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        });

    return () => cancelFunction();
    }, []);
    return {users, error, isLoading};
}

export default useUsers; 