/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { CurrentUser } from "./App";
import Todo from './Todo';
import "../css/todo.css";
import { get } from "../js/controller";
import Add from "./Add";
import Search from "./Search"; // Importing the Search component

function Todos({ message, showMessage }) {
  const { currentUser } = useContext(CurrentUser); // גישה ל-currentUser מתוך הקונטקסט
  const [todos, setTodos] = useState([]); // סטייט לשמירת המשימות
  const [sortBy, setSortBy] = useState('id'); // קריטריון המיון (לפי ברירת מחדל: ID)
  const [filteredTodos, setFilteredTodos] = useState([]); // סטייט למשימות מסוננות

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await get(`todos?userId=${currentUser.id}`);
        setTodos(data);
        setFilteredTodos(data); // התחל עם כל המשימות לא מסוננות
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, [currentUser]);

  // פונקציית מיון
  const sortTodos = (todos, criterion) => {
    switch (criterion) {
      case 'id':
        return [...todos].sort((a, b) => a.id - b.id); // מיון לפי ID
      case 'alphabetical':
        return [...todos].sort((a, b) => a.title.localeCompare(b.title)); // מיון לפי כותרת אלפבית
      case 'completed':
        return [...todos].sort((a, b) => a.completed - b.completed); // מיון לפי מצב ביצוע
      case 'random':
        return [...todos].sort(() => Math.random() - 0.5); // מיון אקראי
      default:
        return todos;
    }
  };

  // הגדרת המיון
  const sortedTodos = sortTodos(filteredTodos, sortBy);

  // חיפוש
  const handleFilter = (filtered) => {
    setFilteredTodos(filtered);
  };
  

  return (
    <div>
      {/* כותרת ושורת המיון */}
      <div className="header-row">
        <h1>Todos</h1>
      </div>
      <Add
        type={"todos"}
        setDetails={setTodos}
        inputs={["title"]}
        knownFields={{ userId: currentUser.id, completed: false }}
        showMessage={showMessage}
        onFilter={handleFilter}
      />

      {/* הודעה למשתמש */}
      {message && <p className="toast">{message}</p>}

      {/* הוספת select למיון */}
      <div>
        <select className="select-option"  onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="id">Sort by ID</option>
          <option value="alphabetical">Sort Alphabetically</option>
          <option value="completed">Sort by Completion</option>
          <option value="random">Sort Randomly</option>
        </select>
      </div>

      {/* שדה חיפוש */}
      <Search
        data={todos}
        onFilter={handleFilter}
        searchFields={["id", "title", "completed"]}
      />

      {/* הצגת משימות */}
      {filteredTodos.length === 0 && (
        <p>No tasks found for the given search criteria.</p>
      )}

      <div className="todos-container">
        {sortedTodos.map((todo) => (
          <div className="todo" key={todo.id}>
            <Todo
              todo={todo}
              setTodos={setTodos}
              showMessage={showMessage}
              onFilter={handleFilter}
              onUpdate={(id, updatedTodo) => {
                setTodos((prevTodos) =>
                  prevTodos.map((todo) =>
                    todo.id === id ? { ...todo, ...updatedTodo } : todo
                  )
                );
                showMessage("Task updated successfully!");
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todos;

