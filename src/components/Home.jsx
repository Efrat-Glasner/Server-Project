import { useContext } from "react";
import "../css/home.css";
import { CurrentUser } from "./App";

const Home = () => {
  const { currentUser } = useContext(CurrentUser);

  return (
    <div className="home-container">
      <h1>{`עמוד בית בפיתוח :)`}</h1>

    </div>
  );
};

export default Home;
