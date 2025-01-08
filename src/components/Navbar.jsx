import "../css/navbar.css";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { CurrentUser } from "./App";
import UserInfo from "./UserInfo";

const Navbar = () => {
    const { setCurrentUser, currentUser } = useContext(CurrentUser);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            const storedUser = JSON.parse(localStorage.getItem("currentUser"));
            if (storedUser) {
                setCurrentUser(storedUser);
            } else {
                // אם אין משתמש שמור, העבר לדף הכניסה
                navigate("/login");
            }
        }
    }, [currentUser, navigate, setCurrentUser]);

    const toggleUserInfo = () => {
        setShowUserInfo((prev) => !prev);
    };

    // אל תציג את ה-Navigation אם המשתמש לא נטען
    if (!currentUser) {
        return null; // אפשר להוסיף ספינר כאן אם רוצים להציג אינדיקציה לטעינה
    }

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <ul className="navbar-links">
                    <li>
                        <Link to="/logout" className="navbar-link">
                            Logout
                        </Link>
                    </li>
                    <li>
                        <Link to={`/home/user/${currentUser.id}`} className="navbar-link">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to={`/user/${currentUser.id}/todos`} className="navbar-link">
                            Todos
                        </Link>
                    </li>
                    <li>
                        <Link to={`/user/${currentUser.id}/posts`} className="navbar-link">
                            Posts
                        </Link>
                    </li>
                    <li>
                        <Link to={`/user/${currentUser.id}/albums`} className="navbar-link">
                            Albums
                        </Link>
                    </li>
                    <li>
                        <button onClick={toggleUserInfo} className="navbar-link user-info-button">
                            User Info
                        </button>
                    </li>

                </ul>
                <h3 className="user-name">{`Hello ${currentUser.username}`}</h3>
            </nav>
            {showUserInfo && <UserInfo onClose={toggleUserInfo} />}
            <Outlet />
        </div>
    );
};

export default Navbar;
