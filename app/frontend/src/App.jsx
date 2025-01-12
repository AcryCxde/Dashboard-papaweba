import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Constructor from './pages/Constructor';
import Login from './pages/Login';
import RecentlyCreated from './pages/RecentlyCreated';
import UploadTables from './pages/UploadTables';
import './styles/App.css';
import Cookies from 'js-cookie';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const cookieIsLoggedIn = Cookies.get('isLoggedIn') === 'true';
    const cookieUsername = Cookies.get('username');

    if (cookieIsLoggedIn && cookieUsername) {
      setIsLoggedIn(true);
      setUsername(cookieUsername);
    }
  }, []);

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
    Cookies.set('isLoggedIn', 'true', { expires: 7 });  // Сохраняем флаг авторизации
    Cookies.set('username', user, { expires: 7 });  // Сохраняем имя пользователя в cookies
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
    Cookies.remove('isLoggedIn');
    Cookies.remove('username');
  };

  const NavigationMenu = () => {
    const location = useLocation();  // Для получения текущего пути
    const links = [
      { path: '/constructor', label: 'Конструктор' },
      { path: '/upload-tables', label: 'Загрузка таблиц' },
      { path: '/recently-created', label: 'Недавно созданные' },
    ];

    return (
      <div className="nav-menu">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Router>
      <div className="header">
        <Link to="/constructor" className="dashboard-link">Dashboard</Link>
        {isLoggedIn && (
          <div className="login-prompt">
            <button onClick={handleLogout}>Выход</button>
          </div>
        )}
      </div>

      {isLoggedIn && <NavigationMenu />}

      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/constructor" /> : <Login onLogin={handleLogin} />} />
        <Route path="/constructor" element={isLoggedIn ? <Constructor /> : <Navigate to="/" />} />
        <Route path="/recently-created" element={isLoggedIn ? <RecentlyCreated /> : <Navigate to="/" />} />
        <Route path="/upload-tables" element={isLoggedIn ? <UploadTables /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
