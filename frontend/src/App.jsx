import React, { useState, useEffect } from 'react';
import TodoForm from './components/todoform.jsx';
import TodoList from './components/todolist.jsx';
import TodoEdit from './components/todoedit.jsx';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/todo';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Todos from FastAPI
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/`);
      if (!res.ok) {
        throw new Error(`Failed to fetch tasks: ${res.statusText}`);
      }
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
      setError(
        'Could not connect to the backend server. Please ensure FastAPI is running at http://127.0.0.1:8000 (run `uvicorn backend.main:app --reload`).'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. Add new Todo
  const handleAddTodo = async (newTodoData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodoData),
      });
      if (!res.ok) {
        throw new Error('Failed to create task');
      }
      const createdTodo = await res.json();
      setTodos((prev) => [...prev, createdTodo]);
    } catch (err) {
      console.error(err);
      alert('Error creating task: ' + err.message);
      throw err;
    }
  };

  // 3. Toggle Done status
  const handleToggleDone = async (todo) => {
    const updatedPayload = {
      title: todo.title,
      description: todo.description,
      done: !todo.done,
    };

    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, done: !todo.done } : t))
    );

    try {
      const res = await fetch(`${API_BASE_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });
      if (!res.ok) {
        throw new Error('Failed to toggle status');
      }
      const updatedTodo = await res.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? updatedTodo : t))
      );
    } catch (err) {
      console.error(err);
      // Revert on error
      fetchTodos();
      alert('Error updating status: ' + err.message);
    }
  };

  // 4. Update Todo
  const handleUpdateTodo = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTodo = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (err) {
      console.error(err);
      alert('Error saving task: ' + err.message);
      throw err;
    }
  };

  // 5. Delete Todo
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting task: ' + err.message);
    }
  };

  // Filtered & Searched todos
  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'completed'
        ? todo.done
        : !todo.done;

    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description &&
        todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.done).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-badge">FastAPI + React</div>
        <h1 className="app-title">Task & Todo Manager</h1>
        <p className="app-subtitle">
          Manage your daily goals and keep track of your progress in real-time.
        </p>

        {/* Stats summary bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{totalCount}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Pending</span>
            <span className="stat-value stat-pending">{pendingCount}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value stat-completed">{completedCount}</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="alert-banner">
          <span>⚠️ {error}</span>
          <button className="btn-retry" onClick={fetchTodos}>
            Retry
          </button>
        </div>
      )}

      <main className="main-content">
        <section className="form-section">
          <TodoForm onAddTodo={handleAddTodo} />
        </section>

        <section className="list-section">
          <div className="list-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn-clear"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="filter-tabs">
              <button
                className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({totalCount})
              </button>
              <button
                className={`tab-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({pendingCount})
              </button>
              <button
                className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Done ({completedCount})
              </button>
            </div>
          </div>

          <TodoList
            todos={filteredTodos}
            onToggleDone={handleToggleDone}
            onEdit={(todo) => setEditingTodo(todo)}
            onDelete={handleDeleteTodo}
            loading={loading}
          />
        </section>
      </main>

      {editingTodo && (
        <TodoEdit
          todo={editingTodo}
          onUpdateTodo={handleUpdateTodo}
          onCancel={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
}

export default App;
