import { createContext, useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Home from "./components/Home";
import Todos from "./components/Todos";
import Posts from "./components/Posts";
import Albums from "./components/Albums";
import RegisterDetails from "./components/Register";

export const CurrentUser = createContext({});

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const  navigate  = useNavigate();
  useEffect(() => {
    if (currentUser) {
      navigate(`/home/user/${currentUser.id}`);
    }
  }, [currentUser]);

  return (
    <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterDetails />} />
        <Route path="/home/user/:id" element={<Home />}>
          <Route path="" element={<></>} />
          <Route path="todos" element={<Todos />} />
          <Route path="posts" element={<Posts />} />
          <Route path="albums" element={<Albums />} />
        </Route>
      </Routes>
    </CurrentUser.Provider>
  );
}

export default App;
