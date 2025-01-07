<<<<<<< HEAD
import { Link, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import "../css/navbar.css";
=======
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import "../css/home.css";
>>>>>>> c82b29c3f07db206f19796740641dbd823c7e75c
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
                <Link to="/logout" className="navbar-link">
                    Logout
                </Link>
                <ul className="navbar-links">
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
