/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { CurrentUser } from "../App";
import Todo from './Todo';
import "../css/todo.css";
import { get } from "../js/controller";
import { post } from "../js/controller";

function Todos({message,showMessage}) {
  const { currentUser } = useContext(CurrentUser); // גישה ל-currentUser מתוך הקונטקסט
  const [todos, setTodos] = useState([]); // סטייט לשמירת המשימות
  const [newTask, setNewTask] = useState(""); // סטייט לשמירת המשימה החדשה שהמשתמש מקיש
  const [sortBy, setSortBy] = useState('id'); // קריטריון המיון (לפי ברירת מחדל: ID)
  const [searchQuery, setSearchQuery] = useState(""); // קריטריון החיפוש (כותרת, מזהה, מצב ביצוע)
  const [searchCriterion, setSearchCriterion] = useState("id"); // קריטריון החיפוש (ברירת מחדל: ID)

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
  // פונקציה לסינון על פי חיפוש
  const filterTodos = (todos, query, criterion) => {
    if (!query) return todos;
    
    return todos.filter(todo => {
      switch (criterion) {
        case 'id':
          return todo.id.toString().includes(query); // חיפוש לפי מזהה
        case 'title':
          return todo.title.toLowerCase().includes(query.toLowerCase()); // חיפוש לפי כותרת
        case 'completed':
          return todo.completed.toString().includes(query); // חיפוש לפי מצב ביצוע
        default:
          return todos;
      }
    });
  };

  // הגדרת המיון והחיפוש
  const sortedTodos = sortTodos(todos, sortBy);
  const filteredTodos = filterTodos(sortedTodos, searchQuery, searchCriterion); // חיפוש לפי הקריטריון שנבחר

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
      showMessage("Failed to add the task.", error);
    }
  };

  return (
    <div>
      {/* כותרת ושורת המיון */}
      <div className="header-row">
        <h1>Todos</h1>
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="id">Sort by ID</option>
          <option value="alphabetical">Sort Alphabetically</option>
          <option value="completed">Sort by Completion</option>
          <option value="random">Sort Randomly</option>
        </select>
      </div>
  
      {/* שורת הוספת משימה */}
      <div className="add-row">
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Task</button>
      </div>
      {message && (
        <p style={{ color: message.includes("successfully") ? "green" : "red" }}>
          {message}
        </p>
      )}
  
      {/* שורת החיפוש */}
      <div className="search-row">
      <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          onChange={(e) => setSearchCriterion(e.target.value)}
          value={searchCriterion}
        >
          <option value="id">Search by ID</option>
          <option value="title">Search by Title</option>
          <option value="completed">Search by Completion Status</option>
        </select>
      </div>
  
      {/* הצגת משימות */}
      {filteredTodos.length === 0 && searchQuery && (
        <p>No tasks found for the given search criteria.</p>
      )}
  
      <div className="todos-container">
        {filteredTodos.map((todo) => (
          <div key={todo.id}>
            <Todo
              todo={todo}
              onDelete={(id) => {
                setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
                showMessage("Task deleted successfully!");
              }}
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
