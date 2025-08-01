import React from 'react';
import { useTodo } from '../TodoContext';
import TodoItem from './TodoItem';

function TodoList() {
  const { todos, loading, error } = useTodo();

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (todos.length === 0) {
    return <p>Список дел пуст. Добавьте первую задачу!</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList; 