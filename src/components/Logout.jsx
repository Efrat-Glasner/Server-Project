import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentUser } from "./App";

const Logout = () => {
    const { setCurrentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    useEffect(() => {
        // הסרת המשתמש מהקונטקסט ומה-localStorage
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        navigate("/login"); // ניתוב לדף ההתחברות
    }, [setCurrentUser, navigate]);

    return <p>Logging out...</p>; // הודעת ביניים
};

export default Logout;
