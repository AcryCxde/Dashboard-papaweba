import React, { useState, useEffect } from "react";
import "../styles/Constructor.css";

function Constructor() {
  const [selectedChart, setSelectedChart] = useState(""); // Для типа диаграммы
  const [selectedOptions, setSelectedOptions] = useState({
    section: "",
    topParam: "",
    sideParam: "",
    year: "",
    city: "",
  }); // Для других параметров

  // Данные для выпадающих списков
  const [dropdownData, setDropdownData] = useState({
    sections: [],
    topParams: [],
    sideParams: [],
    years: [],
    cities: [],
  });

  // Загрузка данных из API
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [sectionsRes, topParamsRes, sideParamsRes, yearsRes, citiesRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/dropdown-options/section"),
          fetch("http://127.0.0.1:8000/dropdown-options/topParam"),
          fetch("http://127.0.0.1:8000/dropdown-options/sideParam"),
          fetch("http://127.0.0.1:8000/dropdown-options/year"),
          fetch("http://127.0.0.1:8000/dropdown-options/city"),
        ]);

        const sections = await sectionsRes.json();
        const topParams = await topParamsRes.json();
        const sideParams = await sideParamsRes.json();
        const years = await yearsRes.json();
        const cities = await citiesRes.json();

        setDropdownData({
          sections,
          topParams,
          sideParams,
          years,
          cities,
        });
      } catch (error) {
        console.error("Ошибка при загрузке данных для выпадающих списков:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Функция для изменения типа диаграммы
  const handleChartTypeChange = (chartType) => {
    setSelectedChart(chartType);
  };

  // Функция для изменения параметров
  const handleOptionChange = (key, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Функция для сохранения данных в API
  const saveToAPI = async () => {
    const data = {
      chartType: selectedChart,
      ...selectedOptions,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/create-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Ошибка при сохранении данных");
      }

      const result = await response.json();
      console.log("Диаграмма успешно создана:", result);
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    }
  };

  return (
    <div className="dashboard">
      <main className="dashboard-main">
        {/* Этап 1: Выбор типа диаграммы */}
        <section className="step step-1">
          <h2>Этап 1. Выбрать тип диаграммы</h2>
          <div className="chart-options">
            <label className="chart-option">
              <span className="diagram-choose-container">
                <strong>Гистограмма</strong>
                <p className="text">
                  Используется для сравнения частоты или распределения данных по категориям
                </p>
              </span>
              <input
                type="radio"
                name="chart-type"
                onChange={() => handleChartTypeChange("Гистограмма")}
              />
              <span className="custom-radio"></span>
            </label>
            <label className="chart-option">
              <span className="diagram-choose-container">
                <strong>Круговая диаграмма</strong>
                <p className="text">Отображает доли или пропорции в группе</p>
              </span>
              <input
                type="radio"
                name="chart-type"
                onChange={() => handleChartTypeChange("Круговая диаграмма")}
              />
              <span className="custom-radio"></span>
            </label>
            <label className="chart-option">
              <span className="diagram-choose-container">
                <strong>Линейная диаграмма</strong>
                <p className="text">Показывает изменения или тренды данных во времени</p>
              </span>
              <input
                type="radio"
                name="chart-type"
                onChange={() => handleChartTypeChange("Линейная диаграмма")}
              />
              <span className="custom-radio"></span>
            </label>
          </div>
        </section>

        {/* Этап 2: Выбор разделов */}
        <section className="step step-2">
          <h2>Этап 2. Выбрать разделы</h2>
          <select
            className="dropdown"
            onChange={(e) => handleOptionChange("section", e.target.value)}
          >
            <option value="">Выберите раздел</option>
            {dropdownData.sections.map((section, idx) => (
              <option key={idx} value={section}>
                {section}
              </option>
            ))}
          </select>
        </section>

        {/* Этап 3: Выбор верхнего параметра */}
        <section className="step step-3">
          <h2>Этап 3. Выбор верхнего параметра</h2>
          <select
            className="dropdown"
            onChange={(e) => handleOptionChange("topParam", e.target.value)}
          >
            <option value="">Выберите параметр</option>
            {dropdownData.topParams.map((param, idx) => (
              <option key={idx} value={param}>
                {param}
              </option>
            ))}
          </select>
        </section>

        {/* Этап 4: Выбор бокового параметра */}
        <section className="step step-4">
          <h2>Этап 4. Выбор бокового параметра</h2>
          <select
            className="dropdown"
            onChange={(e) => handleOptionChange("sideParam", e.target.value)}
          >
            <option value="">Выберите параметр</option>
            {dropdownData.sideParams.map((param, idx) => (
              <option key={idx} value={param}>
                {param}
              </option>
            ))}
          </select>
        </section>

        {/* Этап 5: Выбор года */}
        <section className="step step-5">
          <h2>Этап 5. Выбор года</h2>
          <select
            className="dropdown"
            onChange={(e) => handleOptionChange("year", e.target.value)}
          >
            <option value="">Выберите год</option>
            {dropdownData.years.map((year, idx) => (
              <option key={idx} value={year}>
                {year}
              </option>
            ))}
          </select>
        </section>

        {/* Этап 6: Выбор города */}
        <section className="step step-6">
          <h2>Этап 6. Выбор города</h2>
          <select
            className="dropdown"
            onChange={(e) => handleOptionChange("city", e.target.value)}
          >
            <option value="">Выберите город</option>
            {dropdownData.cities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>
        </section>

        <button className="create-chart-button" onClick={saveToAPI}>
          Создать график
        </button>
      </main>
    </div>
  );
}

export default Constructor;
