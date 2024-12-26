import { useEffect, useState, useContext } from "react";
import { CurrentUser } from "../App";
import Todo from './Todo';
import "../css/todo.css";
import { get } from "../js/controller";
import { post } from "../js/controller";

function Todos() {
  const { currentUser } = useContext(CurrentUser); // גישה ל-currentUser מתוך הקונטקסט
  const [todos, setTodos] = useState([]); // סטייט לשמירת המשימות
  const [newTask, setNewTask] = useState(""); // סטייט לשמירת המשימה החדשה שהמשתמש מקיש
  const [message, setMessage] = useState(""); // סטייט להצגת הודעה למשתמש
  const [messageTimeout, setMessageTimeout] = useState(null); // סטייט לשמירת timeout של ההודעה

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        if (!currentUser) return;
        const data = await get(`todoes?userId=${currentUser.id}`);
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
  
    fetchTodos();
  }, [currentUser]);
  

  const handleAddTodo = async () => {
    if (!newTask.trim()) {
      showMessage("Please enter a task!");
      return;
    }
    const isDuplicate = todos.some((todo) => todo.title === newTask.trim());
    if (isDuplicate) {
      showMessage("The task already exists!");
      return;
    }
    const newTodo = {
      userId: currentUser.id,
      title: newTask.trim(),
      complete: false,
    };
  
    try {
      const addedTodo = await post("todoes", newTodo);
      setTodos((prevTodos) => [...prevTodos, addedTodo]);
      setNewTask("");
      showMessage("The task was added successfully!");
    } catch (error) {
      showMessage("Failed to add the task.");
    }
  };

  const handleUpdateTodo = (id, updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      )
    );
  };
  
  const handleDelete = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };
  
  const showMessage = (msg) => {
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }

    setMessage(msg);

    const timeout = setTimeout(() => {
      setMessage(""); // איפוס ההודעה לאחר 2 שניות
    }, 2000);

    setMessageTimeout(timeout);
  };

  return (
    <div>
      <h1>Todos</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Task</button>
      </div>
      {message && <p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>}

      <div className="todos-container">
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            onDelete={handleDelete}
            showMessage={showMessage}
            onUpdate={handleUpdateTodo}
          />
        ))}
      </div>
    </div>
  );
}

export default Todos;
