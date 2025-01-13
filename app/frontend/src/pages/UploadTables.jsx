import React, { useState, useEffect } from 'react';
import '../styles/UploadTables.css';

const Table = () => {
  const [uploadProgress, setUploadProgress] = useState({ loaded: 0, total: 0 });
  const [data, setData] = useState([]);

  // Функция для получения данных с сервера
  const fetchTableData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/nearly_tables');
      if (!response.ok) {
        throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
      }
      const tableData = await response.json();
      setData(tableData);
    } catch (error) {
      console.error('Ошибка при загрузке данных таблицы:', error.message);
    }
  };

  // Вызов fetchTableData при загрузке страницы
  useEffect(() => {
    fetchTableData();
  }, []);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files) return;

    const totalFiles = files.length;
    let loadedFiles = 0;

    setUploadProgress({ loaded: 0, total: totalFiles });

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-tables", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка при загрузке файлов: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Результат загрузки:", result);

      for (const fileResult of result.results) {
        if (fileResult.status === "Done") {
          loadedFiles += 1;
          setUploadProgress({ loaded: loadedFiles, total: totalFiles });
        }
      }
      // Обновляем таблицу после успешной загрузки
      fetchTableData();
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
              <td>{row.username}</td>
              <td>{row.count_of_tables}</td>
              <td>{row.datetime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
