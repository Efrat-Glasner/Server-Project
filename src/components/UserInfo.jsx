/* eslint-disable react/prop-types */
import "../css/userinfo.css"; // ייבוא עיצוב
import { CurrentUser } from "./App";
import { useContext } from "react";

const UserInfo = ({ onClose }) => {
  const { currentUser } = useContext(CurrentUser);

  if (!currentUser) {
    // טיפול במקרה שבו currentUser לא מוגדר
    return (
      <div className="user-info-container">
        <div className="user-info">
          <button onClick={onClose} className="close-button">
            Close
          </button>
          <h2>User Info</h2>
          <p>No user data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-info-container">
      <div className="user-info">
        <button onClick={onClose} className="close-button">
          Close
        </button>
        <h2>User Info</h2>
        <p>Username: {currentUser.username}</p>
        <p>Email: {currentUser.email}</p>
        <p>
          Address: {currentUser.address.street}, {currentUser.address.city}
        </p>
        <p>Company: {currentUser.company.name}</p>
        <p>Phone: {currentUser.phone}</p>
      </div>
    </div>
  );
};

export default UserInfo;
