import { useEffect, useState, useContext } from "react";
import { CurrentUser } from "../App";
import Todo from './Todo';
import "../css/todo.css";

function Todos() {
  const { currentUser } = useContext(CurrentUser); // גישה ל-currentUser מתוך הקונטקסט
  const [todos, setTodos] = useState([]); // סטייט לשמירת המשימות
  const [newTask, setNewTask] = useState(""); // סטייט לשמירת המשימה החדשה שהמשתמש מקיש
  const [message, setMessage] = useState(""); // סטייט להצגת הודעה למשתמש

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
      showMessage("Please enter a task!");
      return;
    }

    // בדיקה אם המשימה כבר קיימת
    const isDuplicate = todos.some((todo) => todo.title === newTask.trim());
    if (isDuplicate) {
      showMessage("The task already exists!");
      return;
    }

    const newTodo = {
      userId: currentUser.id, // ה-ID של המשתמש הנוכחי
      title: newTask.trim(), // המשימה שהמשתמש הקיש
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
      showMessage("The task was added successfully!"); // הודעת הצלחה
    } catch (error) {
      console.error("Error adding todo:", error);
      showMessage("Failed to add the task."); // הודעת שגיאה
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(""); // איפוס ההודעה לאחר 2 שניות
    }, 2000);
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
      {/* הודעה למשתמש */}
      {message && <p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>}
      
      {/* שים את המשימות בתוך div עם class="todos-container" */}
      <div className="todos-container">
        {todos.map((todo) => (
          <div key={todo.id}>
            <Todo todo={todo} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todos;
