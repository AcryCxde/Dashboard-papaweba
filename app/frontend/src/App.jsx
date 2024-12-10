import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Constructor from './pages/Constructor';
import Login from './pages/Login';
import RecentlyCreated from './pages/RecentlyCreated';
import UploadTables from './pages/UploadTables';
import './styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Состояние для имени пользователя
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
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
              element={isLoggedIn ? <Navigate to="/constructor"/> : <Login onLogin={handleLogin}/>}
          />
          <Route path="/constructor" element={isLoggedIn ? <Constructor/> : <Navigate to="/"/>}/>
          <Route path="/recently-created" element={isLoggedIn ? <RecentlyCreated/> : <Navigate to="/"/>}/>
          <Route path="/upload-tables" element={isLoggedIn ? <UploadTables/> : <Navigate to="/"/>}/>
        </Routes>
      </Router>
  );
}

export default App;
