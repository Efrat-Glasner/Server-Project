import { useEffect, useState, useContext } from "react";
import { CurrentUser } from "../App";
import Todo from './Todo';
import '../css/todo.css'
function Todos() {
  const { currentUser } = useContext(CurrentUser); // גישה ל-currentUser מתוך הקונטקסט
  const [todos, setTodos] = useState([]); // סטייט לשמירת המשימות
  const [newTask, setNewTask] = useState(""); // סטייט לשמירת המשימה החדשה שהמשתמש מקיש

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

  const handleAddTodo = async () => {
    if (!newTask.trim()) {
      alert("Please enter a task!");
      return;
    }

    const newTodo = {
      userId: currentUser.id, // ה-ID של המשתמש הנוכחי
      title: newTask, // המשימה שהמשתמש הקיש
      complete: false, // ברירת מחדל של false
    };

    try {
      const response = await fetch("http://localhost:3000/todoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const addedTodo = await response.json();
      setTodos((prevTodos) => [...prevTodos, addedTodo]); // עדכון הסטייט עם המשימה החדשה
      setNewTask(""); // איפוס שדה המשימה
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <div>
      <h1>Todos</h1>
      {/* שדה טקסט וכפתור להוספת משימה */}
      <div>
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Task</button>
      </div>
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
