import React, { useEffect, useState, useRef } from 'react';
import './App.css';
// Импортируем хук useTheme из ThemeContext
import { useTheme } from './ThemeContext';

const API_URL = 'http://127.0.0.1:3001/todos';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [search, setSearch] = useState('');
  const [sortAlpha, setSortAlpha] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const debounceRef = useRef();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchValue(search);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    let url = API_URL;
    const params = [];
    if (searchValue) params.push(`q=${encodeURIComponent(searchValue)}`);
    url += params.length ? `?${params.join('&')}` : '';
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('Ошибка загрузки');
        return r.json();
      })
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [searchValue]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo, completed: false })
    })
      .then((r) => r.json())
      .then((todo) => {
        setTodos((prev) => [...prev, todo]);
        setNewTodo('');
      });
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setTodos((prev) => prev.filter((t) => t.id !== id)));
  };

  const startEdit = (id, title) => {
    setEditId(id);
    setEditText(title);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/${editId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editText })
    })
      .then((r) => r.json())
      .then((todo) => {
        setTodos((prev) => prev.map((t) => t.id === todo.id ? todo : t));
        setEditId(null);
        setEditText('');
      });
  };

  const toggleComplete = (id, completed) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    })
      .then((r) => r.json())
      .then((todo) => {
        setTodos((prev) => prev.map((t) => t.id === todo.id ? todo : t));
      });
  };


  const sortedTodos = sortAlpha
    ? [...todos].sort((a, b) => a.title.localeCompare(b.title))
    : todos;

  return (

    <div className={`App ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
      </button>
      <h1>Список дел</h1>
      <form className="todo-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Новое дело..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
        <button type="submit">Добавить</button>
      </form>
      <div className="todo-controls">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setSortAlpha(s => !s)}>
          {sortAlpha ? 'Обычная сортировка' : 'Сортировать A-Я'}
        </button>
      </div>
      {loading && <p>Загрузка...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul className="todo-list">
        {sortedTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {editId === todo.id ? (
              <form onSubmit={handleEdit} className="edit-form">
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  autoFocus
                />
                <button type="submit">Сохранить</button>
                <button type="button" onClick={() => setEditId(null)}>Отмена</button>
              </form>
            ) : (
              <>
                <span onClick={() => toggleComplete(todo.id, todo.completed)} style={{cursor:'pointer'}}>
                  {todo.title}
                </span>
                <div className="todo-actions">
                  <button onClick={() => startEdit(todo.id, todo.title)}>Изменить</button>
                  <button onClick={() => handleDelete(todo.id)}>Удалить</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
