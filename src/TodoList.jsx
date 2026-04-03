import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = "https://demo-render-hosting.onrender.com";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // ✅ FETCH TODOS
  useEffect(() => {
    axios.get(`${API_BASE}/api/tasks/`)
      .then(response => {
        // ensure it's always an array
        setTodos(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching todos:", error);
        setTodos([]); // prevent map error
        setLoading(false);
      });
  }, []);

  // ✅ ADD TODO
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${API_BASE}/api/tasks/`, {
      task: newTask,
      description: newDesc,
      completed: false
    })
    .then(response => {
      setTodos([...todos, response.data]);
      setNewTask('');
      setNewDesc('');
    })
    .catch(error => console.error('Error adding todo:', error));
  };

  // ✅ TOGGLE COMPLETE
  const toggleComplete = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    axios.put(`${API_BASE}/api/tasks/${id}/`, {
      ...todo,
      completed: !todo.completed
    })
    .then(response => {
      setTodos(todos.map(t => t.id === id ? response.data : t));
    })
    .catch(error => console.error('Error updating todo:', error));
  };

  // ✅ DELETE TODO
  const deleteTodo = (id) => {
    axios.delete(`${API_BASE}/api/tasks/${id}/`)
      .then(() => {
        setTodos(todos.filter(t => t.id !== id));
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input 
          value={newTask} 
          onChange={e => setNewTask(e.target.value)} 
          placeholder="Task" 
          required 
          className="border p-2 mr-2"
        />
        <input 
          value={newDesc} 
          onChange={e => setNewDesc(e.target.value)} 
          placeholder="Description" 
          required 
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Todo
        </button>
      </form>

      {/* ✅ LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : todos.length === 0 ? (
        <p>No todos available</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <li 
              key={todo.id} 
              className="flex items-center justify-between mb-2 p-2 border"
            >
              <span>
                {todo.task} - {todo.description} ({todo.completed ? 'Done' : 'Pending'})
              </span>

              <div>
                <button 
                  onClick={() => toggleComplete(todo.id)} 
                  className="bg-yellow-500 text-white p-1 mr-2"
                >
                  Toggle
                </button>

                <button 
                  onClick={() => deleteTodo(todo.id)} 
                  className="bg-red-500 text-white p-1"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;