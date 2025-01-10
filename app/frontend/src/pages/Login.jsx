import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Cookies from "js-cookie";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Для отображения ошибки
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = Cookies.get("username");
    const savedPassword = Cookies.get("password");
    const savedRememberMe = Cookies.get("rememberMe");

    if (savedRememberMe === "true") {
      setUsername(savedUsername || "");
      setPassword(savedPassword || "");
      setRememberMe(true);
    }
  }, []);

  const handleRememberMeChange = () => {
    setRememberMe((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/login_verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login: username, password: password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (rememberMe) {
        Cookies.set("username", username, { expires: 7 });
        Cookies.set("password", password, { expires: 7 });
        Cookies.set("rememberMe", "true", { expires: 7 });
      } else {
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      onLogin(username);
      navigate("/constructor");
    } else {
      setErrorMessage(data.message || "Ошибка входа. Неверный логин или пароль.");
    }
  };

  return (
    <div className="login-container">
      <h1>Войти</h1>
      <form className="login-form" onSubmit={handleLogin}>
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
        <div className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />
          <label>Запомнить меня</label>
        </div>
        <button type="submit">Войти</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Login;
