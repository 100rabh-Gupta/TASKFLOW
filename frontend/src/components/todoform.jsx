import React, { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddTodo({
        title: title.trim(),
        description: description.trim(),
        done: false,
      });
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create todo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="todo-form-card" onSubmit={handleSubmit}>
      <h2 className="form-title">Create New Task</h2>
      <div className="form-group">
        <label htmlFor="todo-title">Task Title</label>
        <input
          id="todo-title"
          type="text"
          className="form-input"
          placeholder="e.g. Complete Backend API"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="todo-desc">Description</label>
        <textarea
          id="todo-desc"
          className="form-textarea"
          rows={3}
          placeholder="Add details, notes or steps..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting || !title.trim()}>
        {isSubmitting ? (
          <>
            <span className="spinner"></span> Adding...
          </>
        ) : (
          '+ Add Task'
        )}
      </button>
    </form>
  );
}

export default TodoForm;
