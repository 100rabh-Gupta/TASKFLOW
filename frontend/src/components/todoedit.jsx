import React, { useState, useEffect } from 'react';

function TodoEdit({ todo, onUpdateTodo, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [done, setDone] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setDescription(todo.description || '');
      setDone(Boolean(todo.done));
    }
  }, [todo]);

  if (!todo) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdateTodo(todo.id, {
        title: title.trim(),
        description: description.trim(),
        done: done,
      });
      onCancel();
    } catch (err) {
      console.error('Failed to update todo:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Task #{todo.id}</h3>
          <button className="btn-close" type="button" onClick={onCancel}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-desc">Description</label>
            <textarea
              id="edit-desc"
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => setDone(e.target.checked)}
              />
              <span>Mark as Completed</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isUpdating || !title.trim()}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoEdit;
