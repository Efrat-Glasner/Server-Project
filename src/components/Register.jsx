
// --- Second Screen for Details ---
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/form.css";

function RegisterDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, password } = location.state || {};

  const [details, setDetails] = useState({
    name: "",
    email: "",
    address: { street: "", suite: "", city: "", zipcode: "" },
    phone: "",
    website: "",
    company: { name: "", catchPhrase: "", bs: "" },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newUser = {
        username,
        password,
        ...details,
      };

      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="register-details-container">
      <h2>Complete Your Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={details.name}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            required
          />
        </div>
        {/* Add fields for address, phone, website, and company */}
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
}

export default RegisterDetails;
