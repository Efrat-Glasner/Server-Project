import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // ייבוא Link
import "../css/form.css";
import { CurrentUser } from "./App";

function Login() {
  const [user, setUser] = useState({ name: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const { setCurrentUser, currentUser } = useContext(CurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    // אם המשתמש כבר מחובר, ננווט ישירות ל-NAVBAR
    if (currentUser) {
      navigate(`/home/user/${currentUser.id}`);
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const users = await response.json();
      const foundUser = users.find(
        (u) => u.username === user.name && u.website === user.password
      );
      if (foundUser) {
        setCurrentUser(foundUser);
        navigate(`/home/user/${foundUser.id}`);
      } else {
        setErrorMessage("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default Login;
