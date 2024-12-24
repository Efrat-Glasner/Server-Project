import React, { useState } from "react";
import "./Todo.css";

const Todo = ({ todo }) => {
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

  const handleDelete = () => {
    console.log(`Todo with ID: ${todo.id} deleted!`);
    // כאן תוכל לקרוא ל-API או פונקציה למחיקת המשימה
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
        <p>
          <strong>Status:</strong>{" "}
          <span className={`todo-status ${isCompleted ? "completed" : "pending"}`}>
            {isCompleted ? "Completed" : "Not Completed"}
          </span>
        </p>
      </div>
      <div className="todo-actions">
        <button onClick={handleToggle}>
          {isCompleted ? "Unmark" : "Mark as Done"}
        </button>
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
