import React, { useEffect, useState } from 'react';
import api from './services/api';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/')  // Запрос к FastAPI
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error("Ошибка при запросе данных:", error));
  }, []);

  return (
    <div>
      <h1 className = "goida">{message}</h1>
    </div>
  );
}

export default App;
