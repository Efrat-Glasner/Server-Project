import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ייבוא Link
import "../css/form.css";

function Signup() {
  const [user, setUser] = useState({ name: "", password: "", confirmPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // בדיקה אם הסיסמאות תואמות
    if (user.password !== user.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // בקשת GET לבדוק אם המשתמש קיים
      const response = await fetch("http://localhost:3000/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const users = await response.json();
      const existingUser = users.find((u) => u.username === user.name);

      if (existingUser) {
        setErrorMessage("Username already exists.");
      } else {
        // אם המשתמש לא קיים, העברה ל-Register עם פרטים
        navigate("/register", { state: { username: user.name, password: user.password } });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
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
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={user.confirmPassword}
            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="signup-button">Signup</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <p className="login-link">
        Already have an account? <Link to="/login">Log in here</Link>
      </p>
    </div>
  );
}

export default Signup;
