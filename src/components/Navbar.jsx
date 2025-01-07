import { Link, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import "../css/navbar.css";
import { CurrentUser } from "./App";
import UserInfo from "./UserInfo";

const Navbar = () => {
  const { currentUser } = useContext(CurrentUser);
  const [showUserInfo, setShowUserInfo] = useState(false); // מצב להצגת פרטי המשתמש

  const toggleUserInfo = () => {
    setShowUserInfo((prev) => !prev);
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
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
      {showUserInfo && (
        <UserInfo onClose={toggleUserInfo} />
      )}
      <Outlet />
    </div>
  );
};

export default Navbar;
