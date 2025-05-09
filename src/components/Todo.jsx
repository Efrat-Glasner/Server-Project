/* eslint-disable react/prop-types */
import "../css/todo.css";
import Edit from "./Edit";
import Delete from "./Delete";
import { put } from "../js/controller";

const Todo = ({ todo, setTodos, showMessage, onFilter }) => {
  const handleToggleCompleted = async () => {
    try {
      const updatedTodo = await put(`todos/${todo.id}`, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? updatedTodo : t))
      );
      showMessage("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      showMessage("Failed to update the task.");
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-details">
        <p className="todo-id"><strong>ID:</strong> {todo.id}</p>
        <p className="todo-title"> {todo.title}</p>
      </div>

      <div className="todo-actions">
        <Edit
          type="todos"
          item={todo}
          inputs={["title"]}
          setDetails={setTodos}
          showMessage={showMessage}
        />
        <Delete
          types={["todos"]}
          id={todo.id}
          setDetails={setTodos}
          showMessage={showMessage}
          onFilter={onFilter}
        />
        <div className="todo-checkbox-container">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleCompleted}
          className="todo-checkbox"
        />
      </div>

      </div>
    </div>
  );
};
export default Todo;
