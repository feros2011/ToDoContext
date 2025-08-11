import React from 'react';
import './App.css';
import { useTheme } from './ThemeContext';
import TodoForm from './components/TodoForm';
import TodoControls from './components/TodoControls';
import TodoList from './components/TodoList';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`App ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
      </button>
      <h1>Список дел</h1>
      <TodoForm />
      <TodoControls />
      <TodoList />
    </div>
  );
}

export default App;
