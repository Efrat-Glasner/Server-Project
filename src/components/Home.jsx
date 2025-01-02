import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import "../css/home.css";
import { CurrentUser } from "./App";

const Home = () => {
  const { currentUser } = useContext(CurrentUser);
  const [showInfo, setShowInfo] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleInfoClick = () => {
    if (location.pathname !== `/home/user/${currentUser.id}`) {
      navigate(`/home/user/${currentUser.id}`); // שינוי הנתיב
    }
    setShowInfo(true);
  };

  useEffect(() => {
    if (location.pathname !== `/home/user/${currentUser.id}`) {
      setShowInfo(false);
    }
  }, [location.pathname]);

  return (
    <div className="home-container">
      <h1>{`Hello ${currentUser.username}`}</h1>
      {/* סרגל ניווט */}
      <nav className="home-navbar">
        <ul className="home-navbar-links">
          <li>
            <span onClick={handleInfoClick} className="home-navbar-link">
              Info
            </span>
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
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Home;

