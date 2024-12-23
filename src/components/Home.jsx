// import React from "react";
import { Link, useNavigate, useParams, Outlet } from "react-router-dom";
import { useContext } from "react";

import "../css/home.css";
import { CurrentUser } from "../App";

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const { currentUser, setCurrentUser } = useContext(CurrentUser)

  const navigate = useNavigate();
  // useEffect(() => {
  //   if (currentUser) {
  //     // עדכון ה-URL כך שיכלול את ה-ID של המשתמש בסוף
  //     navigate(`/home/user/${currentUser.id}`);
  //   }
  // }, [currentUser, navigate]);
  const { section } = useParams(); // מקבלים את ה-param של הכתובת

  const handleInfoClick = () => {
    // מעדכנים את ה-URL ל-/home/info
    navigate(`/home/user/${currentUser.id}/info`);
  };
  return (
    <div className="home-container">
      <h1>{`Hello ${currentUser.username}`}</h1>
      {/* סרגל ניווט */}
      <nav className="home-navbar">
        <ul className="home-navbar-links">
          <li>
            <span onClick={handleInfoClick} className="home-navbar-link">
              Info
            </span >
          </li>
          <li>
            <Link to="todos" className="home-navbar-link">Todos</Link>
          </li>
          <li>
            <Link to="posts" className="home-navbar-link">Posts</Link>
          </li>
          <li>
            <Link to="albums" className="home-navbar-link">Albums</Link>
          </li>
          {/* <li>
            <Link to="logout" className="home-navbar-link">Logout</Link>
          </li> */}
        </ul>
      </nav>
      {section === "info" && (
        <div className="user-info">
          <h2>User Info</h2>
          <p>Username: {currentUser.username}</p>
          <p>Email: {currentUser.email}</p>
          <p>Address: {currentUser.address.street}, {currentUser.address.city}</p>
          <p>Company: {currentUser.company.name}</p>
          <p>Phone: {currentUser.phone}</p>
          {/* פרטים נוספים */}
        </div>
      )}

      {/* תצוגת נתיבים */}
      <Outlet />
    </div>
  );
};

export default Home;
