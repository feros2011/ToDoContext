import React, { useState } from 'react';
import { useTodo } from '../TodoContext';

function TodoForm() {
  const [newTodo, setNewTodo] = useState('');
  const { addTodo } = useTodo();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Новое дело..."
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button type="submit">Добавить</button>
    </form>
  );
}

export default TodoForm; 