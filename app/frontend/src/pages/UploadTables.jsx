import React from 'react';
import '../styles/UploadTables.css';

const Table = () => {
  const data = [
    { name: "Волейбол 2020-2022", fields: "Всего, Волейбол", date: "11.01.2025" },
    { name: "Новые работники", fields: "Специалисты, впервые принявшие ислам, маленькая строка получилась :(", date: "10.01.2025" },
    { name: "Новые работники", fields: "Специалисты, впервые при...", date: "10.01.2025" },
    { name: "Новые работники", fields: "Специалисты, впервые при...", date: "10.01.2025" },
  ];

  return (
    <div className="page-container">
      <button className="upload-table-button">Загрузить таблицы</button>
      <div className="page-content">
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
