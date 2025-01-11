import React, { useState } from 'react';
import '../styles/Constructor.css';

function Constructor() {
  const [selectedChart, setSelectedChart] = useState('');

  // Функция для выбора диаграммы
  const handleChartSelect = (chartType) => {
    setSelectedChart(chartType);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="step-container">
          <h2>Этап 1. Выбрать тип диаграммы</h2>
          <div className="checkbox-group">
            {['Гистограмма', 'Круговая диаграмма', 'Линейная диаграмма'].map((chart) => (
              <label key={chart} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedChart === chart}
                  onChange={() => handleChartSelect(chart)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{chart}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Constructor;
