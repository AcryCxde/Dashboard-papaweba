import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    const cookieUsername = Cookies.get('username');

    if ((storedIsLoggedIn === 'true' && storedUsername) || cookieUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername || cookieUsername);
    }
  }, []);

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', user);
    Cookies.set('username', user, { expires: 7 });
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    Cookies.remove('username');
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
        <Route path="/" element={isLoggedIn ? <Navigate to="/constructor" /> : <Login onLogin={handleLogin} />} />
        <Route path="/constructor" element={isLoggedIn ? <Constructor /> : <Navigate to="/" />} />
        <Route path="/recently-created" element={isLoggedIn ? <RecentlyCreated /> : <Navigate to="/" />} />
        <Route path="/upload-tables" element={isLoggedIn ? <UploadTables /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
