// import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useContext, useState } from "react";

import "../css/home.css";
import { CurrentUser } from "../App";

const Home = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUser)
  const [showInfo, setShowInfo] = useState(false);
  // const navigate = useNavigate();
  // const { section } = useParams();

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
    // navigate(`/home/user/${currentUser.id}`);
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
      {showInfo ? (
        <div className="user-info">
          <h2>User Info</h2>
          <p>Username: {currentUser.username}</p>
          <p>Email: {currentUser.email}</p>
          <p>Address: {currentUser.address.street}, {currentUser.address.city}</p>
          <p>Company: {currentUser.company.name}</p>
          <p>Phone: {currentUser.phone}</p>
        </div>
      ) : null}

      {/* תצוגת נתיבים */}
      <Outlet />
    </div>
  );
};

export default Home;
