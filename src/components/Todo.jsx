/* eslint-disable react/prop-types */
import { useState } from "react";
import "../css/todo.css";
import { deleteRequest } from "../js/controller";
import { put } from "../js/controller";

const Todo = ({ todo, onDelete, showMessage, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const updateTodo = async (updatedData) => {
    try {
      // עדכון כל הנתונים, לא רק את השדה המועדכן
      const updatedTodo = await put(`todoes/${todo.id}`, {
        ...todo, // שמירת כל שאר הנתונים מהמשימה הישנה
        ...updatedData // עדכון רק את הנתונים ששונו
      });
  
      console.log(`Todo with ID: ${todo.id} updated!`);
  
      // עדכון המשימה המעודכנת בקומפוננטת Todos
      onUpdate(todo.id, updatedTodo); // עדכון המשימה בהצלחה
    } catch (error) {
      console.error("Error updating the todo:", error);
      showMessage("Failed to update the task.");
    }
  };
  
  const handleSave = async () => {
    if (newTitle.trim() === "") return;
    setIsEditing(false);
  
    await updateTodo({ title: newTitle }); // עדכון הכותרת באמצעות PUT
  };
  
  const handleToggle = async () => {
    setIsCompleted(!isCompleted);
    await updateTodo({ completed: !isCompleted }); // עדכון מצב ההשלמה באמצעות PUT
  };
  

  const handleDelete = async () => {
    try {
      await deleteRequest(`todoes/${todo.id}`); // קריאה לפקודת DELETE
      console.log(`Todo with ID: ${todo.id} deleted!`);
      onDelete(todo.id); // קריאה למחיקת המשימה מהסטייט של Todos
    } catch (error) {
      console.error("Error deleting the todo:", error);
      showMessage("Failed to delete the task.");
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
