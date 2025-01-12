import React from 'react';
import '../styles/RecentlyCreated.css';

const Table = () => {
  const data = [
    { name: "Текст", fields: "Текст", date: "11.01.2025" },
    { name: "Текста тут Текст много", fields: "ОГРОООООМНЫЙ ТЕКСТ", date: "10.01.2025" },
    { name: "Текст овоаыо оаыо ыыооа ыроа ооыа раыо ораоо рыыоа роы", fields: "Текст", date: "10.01.2025" },
    { name: "Текст", fields: "Текстттттттттттттттттттттттттттттттттттттттттттттттт", date: "10.01.2025" },
  ];

  return (
    <div className="page-container">
      <h1 className="recent">Недавние</h1>
      <div className="page-content">
      </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Поля</th>
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
