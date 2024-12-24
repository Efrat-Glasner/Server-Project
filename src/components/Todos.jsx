import { useEffect, useState, useContext } from "react";
import { CurrentUser } from "../App";

function Todos() {
  const { currentUser } = useContext(CurrentUser); // גישה ל-currentUser מתוך הקונטקסט
  const [todos, setTodos] = useState([]); // סטייט לשמירת המשימות

  useEffect(() => {
    // שליחת בקשת GET לשרת עבור המשימות של המשתמש הנוכחי
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/todoes?userId=${currentUser.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await response.json();
        setTodos(data); // שמירת המשימות בסטייט
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    if (currentUser) {
      fetchTodos();
    }
  }, [currentUser]);

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {/* עבור כל משימה, נציג את קומפוננטת Todo */}
        {todos.map((todo) => (
          <li key={todo.id}>
            <Todo todo={todo} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
