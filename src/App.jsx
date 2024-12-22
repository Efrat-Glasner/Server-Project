import { createContext, useState } from 'react';
import './App.css';
import '../db.json'
import Login from './components/Login';
import Signup from './components/SignUp';
import RegisterDetails from './components/Register';
import { Route, Routes } from 'react-router-dom';

export const CurrentUser = createContext({});


function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterDetails />} />
      </Routes>
    </CurrentUser.Provider>
  );
}

export default App;