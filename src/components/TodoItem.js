import React, { useState, useEffect } from 'react';
import { useTodo } from '../TodoContext';

function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const { deleteTodo, editTodo, toggleComplete } = useTodo();

  useEffect(() => {
    setEditText(todo.title);
  }, [todo.title]);

  const handleEdit = (e) => {
    e.preventDefault();
    if (editText.trim() && editText !== todo.title) {
      editTodo(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleToggle = () => {
    toggleComplete(todo.id, todo.completed);
  };

  if (isEditing) {
    return (
      <li className={todo.completed ? 'completed' : ''}>
        <form onSubmit={handleEdit} className="edit-form">
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Отмена
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className={todo.completed ? 'completed' : ''}>
      <span onClick={handleToggle} style={{ cursor: 'pointer' }}>
        {todo.title}
      </span>
      <div className="todo-actions">
        <button onClick={() => setIsEditing(true)}>Изменить</button>
        <button onClick={handleDelete}>Удалить</button>
      </div>
    </li>
  );
}

export default TodoItem; 