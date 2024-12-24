<<<<<<< HEAD
import Todo from './Todo';

function Todos() {
    return(
        <>
        <h1>Todos</h1>
        <Todo/>
        </>
    ) 
=======
import { useEffect, useContext } from "react";
import { CurrentUser } from "../App";
function Todos() {
    const [currentUser, setCurrentUser] = useContext(CurrentUser);
    const response = await fetch("http://localhost:3000/todos");
    return (
        <h1>Todos</h1>
    )
>>>>>>> 546de5465a4a77dcffbbd6430671d10800f3319e
}
export default Todos;