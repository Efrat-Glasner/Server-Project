import { createContext, useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "../css/App.css";
import Login from "./Login";
import Signup from "./SignUp";
import Home from "./Home";
import Todos from "./Todos";
import Posts from "./Posts";
import Albums from "./Albums";
import RegisterDetails from "./Register";

export const CurrentUser = createContext({});

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageTimeout, setMessageTimeout] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      navigate(`/home/user/${currentUser.id}`);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const showMessage = (msg) => {
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }
    setMessage(msg);
    const timeout = setTimeout(() => {
      setMessage("");
    }, 2000);
    setMessageTimeout(timeout);
  };
  return (
    <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterDetails />} />
        <Route path="/home/user/:id" element={<Home />}>
          <Route path="" element={<></>} />
          <Route path="todos" element={<Todos message={message} showMessage={showMessage} />} />
          <Route path="posts" element={<Posts message={message} showMessage={showMessage} />} />
          <Route path="albums" element={<Albums message={message} showMessage={showMessage} />} />
        </Route>
      </Routes>
    </CurrentUser.Provider>
  );
}

export default App;
