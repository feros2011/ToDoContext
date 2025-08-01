import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const TodoContext = createContext();

const API_URL = 'http://127.0.0.1:3001/todos';

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [sortAlpha, setSortAlpha] = useState(false);
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


  const addTodo = (title) => {
    if (!title.trim()) return;
    
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), completed: false })
    })
      .then((r) => r.json())
      .then((todo) => {
        setTodos((prev) => [...prev, todo]);
      })
      .catch((err) => {
        setError('Ошибка добавления задачи');
      });
  };


  const deleteTodo = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setTodos((prev) => prev.filter((t) => t.id !== id)))
      .catch((err) => {
        setError('Ошибка удаления задачи');
      });
  };

 
  const updateTodo = (id, updates) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
      .then((r) => r.json())
      .then((todo) => {
        setTodos((prev) => prev.map((t) => t.id === todo.id ? todo : t));
      })
      .catch((err) => {
        setError('Ошибка обновления задачи');
      });
  };


  const toggleComplete = (id, completed) => {
    updateTodo(id, { completed: !completed });
  };


  const editTodo = (id, title) => {
    if (!title.trim()) return;
    updateTodo(id, { title: title.trim() });
  };

  const sortedTodos = sortAlpha
    ? [...todos].sort((a, b) => a.title.localeCompare(b.title))
    : todos;

  const value = {
    todos: sortedTodos,
    loading,
    error,
    search,
    setSearch,
    sortAlpha,
    setSortAlpha,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleComplete,
    editTodo
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  return useContext(TodoContext);
} 