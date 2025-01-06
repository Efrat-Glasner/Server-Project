import { createContext, useState, useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import "../css/App.css";
import Login from "./Login";
import Signup from "./SignUp";
import Home from "./Home";
import Todos from "./Todos";
import Posts from "./Posts";
import Albums from "./Albums";
import RegisterDetails from "./Register";
import Navbar from "./Navbar";
import Comments from "./Comments";
import Post from "./Post";
import NotFound from "./NotFound"; // עמוד שגיאה מותאם אישית
export const CurrentUser = createContext({});

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageTimeout, setMessageTimeout] = useState(null);

  useEffect(() => {
    if (currentUser) {
      navigate(`/home/user/${currentUser.id}`);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
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
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterDetails />} />
        
        {/* סרגל כלים כעטיפה */}
        <Route element={<Navbar />}>
          {/* עמוד הבית */}
          <Route path="/home/user/:id" element={<Home />} />
          {/* עמודים פנימיים */}
          <Route path="/user/:id/todos" element={<Todos message={message} showMessage={showMessage} />} />
          <Route path="/user/:id/posts" element={<Posts message={message} showMessage={showMessage} />} >
            <Route path="/user/:id/posts/:postId/" element={<Post />} />
            <Route path="/user/:id/posts/:postId/comments" element={<Comments />} />
          </Route>
          <Route path="/user/:id/albums" element={<Albums message={message} showMessage={showMessage} />} />
        </Route>
        
        {/* עמוד שגיאה */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CurrentUser.Provider>
  );
}

export default App;
