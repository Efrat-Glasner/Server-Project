import { useState, useContext , useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/form.css";

import { CurrentUser } from "./App";

function Register() {
  const { setCurrentUser, currentUser } = useContext(CurrentUser);
  const navigate = useNavigate();
  const location = useLocation(); // Hook לגישה לנתוני state
  const { username, password } = location.state || {}; // קריאה לנתונים מ-state
  const [details, setDetails] = useState({
    username: username,
    website: password,
    name: "",
    email: "",
    address: { street: "", suite: "", city: "", zipcode: "", geo: { lat: "", lng: "" } },
    phone: "",
    company: { name: "", catchPhrase: "", bs: "" }
  });
  useEffect(() => {
      // אם המשתמש כבר מחובר, ננווט ישירות ל-NAVBAR
      if (currentUser) {
        navigate(`/home/user/${currentUser.id}`);
      }
    }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

       await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // ממיר את התשובה לאובייקט JSON
      }).then((newUser) => {
        // עדכון currentUser ישירות עם התשובה מהשרת
        setCurrentUser(newUser);
      }).catch((error) => {
        console.error("Error:", error);
      });
      
      // Navigate to the home page
      navigate(`/home/user/:id`);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="register-container">
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
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={details.address.city}
            onChange={(e) => setDetails({ ...details, address: { ...details.address, city: e.target.value } })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="street">Street:</label>
          <input
            type="text"
            id="street"
            value={details.address.street}
            onChange={(e) => setDetails({ ...details, address: { ...details.address, street: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="suite">Suite:</label>
          <input
            type="text"
            id="suite"
            value={details.address.suite}
            onChange={(e) => setDetails({ ...details, address: { ...details.address, suite: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="zipcode">Zipcode:</label>
          <input
            type="text"
            id="zipcode"
            value={details.address.zipcode}
            onChange={(e) => setDetails({ ...details, address: { ...details.address, zipcode: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lat">Latitude:</label>
          <input
            type="text"
            id="lat"
            value={details.address.geo.lat}
            onChange={(e) => setDetails({ ...details, address: { ...details.address, geo: { ...details.address.geo, lat: e.target.value } } })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lng" onChange={(e) => setDetails({
            ...details,
            address: {
              ...details.address,
              geo: {
                ...details.address.geo,
                lng: e.target.value
              }
            }
          })}>Longitude:</label>
          

        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            value={details.phone}
            onChange={(e) => setDetails({ ...details, phone: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={details.company.name}
            onChange={(e) => setDetails({ ...details, company: { ...details.company, name: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="catchPhrase">Catch Phrase:</label>
          <input
            type="text"
            id="catchPhrase"
            value={details.company.catchPhrase}
            onChange={(e) => setDetails({ ...details, company: { ...details.company, catchPhrase: e.target.value } })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bs">Business Strategy:</label>
          <input
            type="text"
            id="bs"
            value={details.company.bs}
            onChange={(e) => setDetails({ ...details, company: { ...details.company, bs: e.target.value } })}
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
}

export default Register;
