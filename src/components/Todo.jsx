/* eslint-disable react/prop-types */
import { useState } from "react";
import "../css/todo.css";

const Todo = ({ todo, onDelete ,showMessage}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const handleToggle = () => {
    setIsCompleted(!isCompleted);
  };

  const handleSave = () => {
    if (newTitle.trim() === "") return;
    todo.title = newTitle; // עדכון הכותרת באובייקט המקומי
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/todoes/${todo.id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete the todo.");
      }
  
      console.log(`Todo with ID: ${todo.id} deleted!`);
      onDelete(todo.id); // קריאה למחיקת המשימה מהסטייט של Todos
    } catch (error) {
      console.error("Error deleting the todo:", error);
      showMessage("Failed to delete the task."); // הצגת הודעת שגיאה
    }
  };
  

  return (
    <div className="todo-container">
      <div className="todo-details">
        <p><strong>ID:</strong> {todo.id}</p>
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="todo-edit-input"
          />
        ) : (
          <p><strong>Title:</strong> {todo.title}</p>
        )}
      </div>
      <div className="todo-checkbox-container">
        <label className="todo-checkbox-label"></label>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          className="todo-checkbox"
        />
      </div>
      <div className="todo-actions">
        {isEditing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default Todo;
