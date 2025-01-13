import React, { useState } from 'react';
import '../styles/UploadTables.css';

const Table = () => {
  const [uploadProgress, setUploadProgress] = useState({ loaded: 0, total: 0 });
  const [data, setData] = useState([
    { name: "Волейбол 2020-2022", fields: "Всего, Волейбол", date: "11.01.2025" },
    { name: "Новые работники", fields: "Специалисты, впервые при...", date: "10.01.2025" },
  ]);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files) return;

    const totalFiles = files.length;
    let loadedFiles = 0;

    setUploadProgress({ loaded: 0, total: totalFiles });

    // Создаем FormData и добавляем все файлы
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file); // Ключ должен совпадать с параметром эндпоинта на сервере
    }

    try {
      // Отправляем файлы на сервер
      const response = await fetch("http://127.0.0.1:8000/upload-tables", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка при загрузке файлов: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Результат загрузки:", result);

      // Обновляем прогресс по мере обработки каждого файла
      for (const fileResult of result.results) {
        if (fileResult.status === "Done") {
          loadedFiles += 1;
          setUploadProgress({ loaded: loadedFiles, total: totalFiles });
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error.message);
    }
  };

  return (
    <div className="page-container">
      <label className="upload-table-button">
        Загрузить таблицы
        <input
          type="file"
          multiple
          accept=".xlsx,.xlsm,.xls"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </label>

      <div className="progress-container">
        {uploadProgress.total > 0 && (
          <p>Загружено {uploadProgress.loaded} из {uploadProgress.total} таблиц</p>
        )}
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Имя пользователя</th>
            <th>Количество таблиц</th>
            <th>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.fields}</td>
              <td>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
