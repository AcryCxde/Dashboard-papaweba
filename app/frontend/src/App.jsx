import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Constructor from './pages/Constructor';
import Login from './pages/Login';
import RecentlyCreated from './pages/RecentlyCreated';
import UploadTables from './pages/UploadTables';
import './styles/App.css';
import Cookies from 'js-cookie'; // Подключаем библиотеку для работы с cookies

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Проверяем авторизацию при загрузке приложения
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    const cookieUsername = Cookies.get('username'); // Проверяем куки

    // Если в куках есть имя пользователя или в localStorage статус авторизации, то считаем пользователя авторизованным
    if ((storedIsLoggedIn === 'true' && storedUsername) || cookieUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername || cookieUsername);
    }
  }, []);

  // Обработчик входа
  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // Сохраняем статус авторизации
    localStorage.setItem('username', user); // Сохраняем имя пользователя
    Cookies.set('username', user, { expires: 7 }); // Сохраняем имя пользователя в cookies
  };

  // Обработчик выхода
  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn'); // Удаляем статус авторизации
    localStorage.removeItem('username'); // Удаляем имя пользователя
    Cookies.remove('username'); // Удаляем имя пользователя из cookies
  };

  return (
    <Router>
      <div className="header">
        <div className="dashboard">
          <Link to="/constructor" className="dashboard-link">Dashboard</Link>
        </div>

        <div className="login-prompt">
          {isLoggedIn ? (
            <div className="user-info">
              <span>{username}</span>
              <button onClick={handleLogout}>Выход</button>
            </div>
          ) : (
            <div>
              <span>Войти</span>
            </div>
          )}
        </div>
      </div>

      {isLoggedIn && (
        <div className="nav-panel">
          <div className="nav-item">
            <Link to="/constructor">Конструктор</Link>
          </div>
          <div className="nav-item">
            <Link to="/upload-tables">Загрузить таблицы</Link>
          </div>
          <div className="nav-item">
            <Link to="/recently-created">Недавно созданные</Link>
          </div>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/constructor" /> : <Login onLogin={handleLogin} />}
        />
        <Route path="/constructor" element={isLoggedIn ? <Constructor /> : <Navigate to="/" />} />
        <Route path="/recently-created" element={isLoggedIn ? <RecentlyCreated /> : <Navigate to="/" />} />
        <Route path="/upload-tables" element={isLoggedIn ? <UploadTables /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
