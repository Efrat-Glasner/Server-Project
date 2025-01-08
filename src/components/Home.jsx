import { useContext } from "react";
import "../css/home.css";
import { CurrentUser } from "./App";

const Home = () => {
  const { currentUser } = useContext(CurrentUser);

  return (
    <div className="home-container">
      {/* Full-page background image */}
      <div className="background-overlay">
        <div className="content-wrapper">
          {/* Website Title */}
          <h1 className="site-title">Create Your Chapter</h1>

          {/* User-specific greeting */}
          <p className="greeting animated-text">
            {currentUser
              ? `Welcome back, ${currentUser.name}! Ready to start a new chapter?`
              : "Welcome! Start creating your story today."}
          </p>

          {/* Description of features */}
          <div className="features animated-text">
            <p>Create and manage tasks with ease.</p>
            <p>Read inspiring posts from our community.</p>
            <p>Engage by commenting and sharing your thoughts.</p>
            <p>Showcase your journey with photo albums.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
