import React from 'react';

function TodoList({ todos, onToggleDone, onEdit, onDelete, loading }) {
  if (loading && todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="spinner-large"></div>
        <p>Loading your tasks from database...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks found</h3>
        <p>You have no tasks here. Add a new task using the form above to get started!</p>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`todo-card ${todo.done ? 'todo-done' : 'todo-pending'}`}
        >
          <div className="todo-main">
            <label className="checkbox-custom" title="Toggle status">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => onToggleDone(todo)}
              />
              <span className="checkmark"></span>
            </label>

            <div className="todo-info">
              <div className="todo-header-row">
                <h3 className="todo-title">{todo.title}</h3>
                <span className={`badge ${todo.done ? 'badge-success' : 'badge-warning'}`}>
                  {todo.done ? 'Completed' : 'Pending'}
                </span>
              </div>
              {todo.description && (
                <p className="todo-description">{todo.description}</p>
              )}
            </div>
          </div>

          <div className="todo-actions">
            <button
              type="button"
              className="btn-icon btn-edit"
              title="Edit Task"
              onClick={() => onEdit(todo)}
            >
              ✏️
            </button>
            <button
              type="button"
              className="btn-icon btn-delete"
              title="Delete Task"
              onClick={() => onDelete(todo.id)}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
