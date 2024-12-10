import React, { useState } from 'react';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    } else {
      alert('Введите имя пользователя и пароль');
    }
  };

  return (
    <div className="login-container">
      <h1>Dashboard</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="login-options">
          <label>
            <input type="checkbox" /> Запомнить меня
          </label>
        </div>
        <button type="submit">Войти</button>
      </form>
      <div className="additional-text">
        <p>Если у вас нет аккаунта, зарегистрируйтесь</p>
      </div>
    </div>
  );
}

export default Login;
