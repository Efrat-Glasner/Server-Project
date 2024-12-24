import { useEffect, useContext } from "react";
import { CurrentUser } from "../App";
function Todos() {
    const [currentUser, setCurrentUser] = useContext(CurrentUser);
    const response = await fetch("http://localhost:3000/todos");
    return (
        <h1>Todos</h1>
    )
}
export default Todos;