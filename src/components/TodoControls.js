import React from 'react';
import { useTodo } from '../TodoContext';

function TodoControls() {
  const { search, setSearch, sortAlpha, setSortAlpha } = useTodo();

  return (
    <div className="todo-controls">
      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={() => setSortAlpha(!sortAlpha)}>
        {sortAlpha ? 'Обычная сортировка' : 'Сортировать A-Я'}
      </button>
    </div>
  );
}

export default TodoControls; 