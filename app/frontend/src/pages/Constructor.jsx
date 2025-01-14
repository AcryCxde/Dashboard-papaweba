import React, { useState, useEffect } from "react";
import "../styles/Constructor.css";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

function Constructor() {
  const [selectedChart, setSelectedChart] = useState(""); // Для типа диаграммы
  const [selectedOptions, setSelectedOptions] = useState({
    section: "",
    topParam: "",
    sideParam: "",
    year: [],
    city: [],
  }); // Для других параметров

  const [dropdownData, setDropdownData] = useState({
    sections: [],
    topParams: [],
    sideParams: [],
    years: [],
    cities: [],
  });

  // Загрузка данных для выпадающих списков
  useEffect(() => {
    const fetchData = async (url, key) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка при загрузке ${key}`);
        const data = await response.json();
        setDropdownData((prev) => ({ ...prev, [key]: data.data }));
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData("http://127.0.0.1:8000/dropdown-options/section", "sections");
    fetchData("http://127.0.0.1:8000/dropdown-options/year", "years");
    fetchData("http://127.0.0.1:8000/dropdown-options/city", "cities");
  }, []);

  const fetchParams = async (sectionId) => {
    try {
      const [topParamsRes, sideParamsRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/dropdown-options/topParam/${sectionId}`),
        fetch(`http://127.0.0.1:8000/dropdown-options/sideParam/${sectionId}`),
      ]);

      if (!topParamsRes.ok) throw new Error("Ошибка при загрузке верхних параметров");
      if (!sideParamsRes.ok) throw new Error("Ошибка при загрузке боковых параметров");

      const topParams = await topParamsRes.json();
      const sideParams = await sideParamsRes.json();

      setDropdownData((prev) => ({
        ...prev,
        topParams: topParams.data,
        sideParams: sideParams.data,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleChartTypeChange = (chartType) => {
    setSelectedChart(chartType);
    setSelectedOptions({
      ...selectedOptions,
      topParam: chartType === "Круговая диаграмма" ? "" : [],
      sideParam: chartType === "Круговая диаграмма" ? "" : [],
      year: [],
      city: [],
    });
  };

  const handleOptionChange = (key, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "section" && value) fetchParams(value);
  };

  const [chartData, setChartData] = useState(null); // Данные для построения графика

  const saveToAPI = async () => {
    const data = {
      chartType: selectedChart,
      ...selectedOptions,
    };

    console.log("Отправляемые данные:", JSON.stringify(data, null, 2));

    try {
      const response = await fetch("http://127.0.0.1:8000/create-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Ошибка при сохранении данных");

      const result = await response.json();
      console.log("Диаграмма успешно создана:", result);

      // Здесь обновляем данные графика
      setChartData({
        labels: result.data.labels, // Метки осей (предполагаем, что API возвращает их)
        datasets: [
          {
            label: "Данные диаграммы",
            data: result.data.values, // Значения диаграммы
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Цвета для круговой диаграммы
            borderColor: "#ddd", // Цвет границ
            borderWidth: 1,
          },
        ],
      });
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
                checked={selectedChart === "Гистограмма"}
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
                checked={selectedChart === "Круговая диаграмма"}
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
                checked={selectedChart === "Линейная диаграмма"}
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
              <option key={idx} value={idx + 1}>
                {section}
              </option>
            ))}
          </select>
        </section>

        {/* Этап 3: Выбор верхнего параметра */}
        <section className="step step-3">
          <h2>Этап 3. Выбор верхнего параметра</h2>
            <div className="checkbox-group">
              {dropdownData.topParams.map((param, idx) => (
                <label key={idx} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={param}
                    checked={selectedOptions.topParam.includes(param)}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      handleOptionChange(
                        "topParam",
                        checked
                          ? [...selectedOptions.topParam, value]
                          : selectedOptions.topParam.filter((item) => item !== value)
                      );
                    }}
                  />
                  {param}
                </label>
              ))}
            </div>
        </section>

        {/* Этап 4: Выбор бокового параметра */}
        <section className="step step-4">
          <h2>Этап 4. Выбор бокового параметра</h2>
            <div className="checkbox-group">
              {dropdownData.sideParams.map((param, idx) => (
                <label key={idx} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={param}
                    checked={selectedOptions.sideParam.includes(param)}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      handleOptionChange(
                        "sideParam",
                        checked
                          ? [...selectedOptions.sideParam, value]
                          : selectedOptions.sideParam.filter((item) => item !== value)
                      );
                    }}
                  />
                  {param}
                </label>
              ))}
            </div>
        </section>

        {/* Этап 5: Выбор года */}
        <section className="step step-5">
          <h2>Этап 5. Выбор года</h2>
            <div className="checkbox-group">
              {dropdownData.years.map((year, idx) => (
                <label key={idx} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={String(year)} // Приведение к строке для унификации типов
                    checked={selectedOptions.year.includes(String(year))}
                    onChange={(e) => {
                        const { checked, value } = e.target;
                        const updatedYears = checked
                          ? Array.from(new Set([...selectedOptions.year, value])) // Уникальные значения
                          : selectedOptions.year.filter((item) => item !== value);

                        handleOptionChange("year", updatedYears);
                      }}
                    />
                  {year}
                </label>
              ))}
            </div>
        </section>

        {/* Этап 6: Выбор города */}
        <section className="step step-6">
          <h2>Этап 6. Выбор города</h2>
            <div className="checkbox-group">
              {dropdownData.cities.map((city, idx) => (
                <label key={idx} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={city}
                    checked={selectedOptions.city.includes(city)}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      handleOptionChange(
                        "city",
                        checked
                          ? [...selectedOptions.city, value]
                          : selectedOptions.city.filter((item) => item !== value)
                      );
                    }}
                  />
                  {city}
                </label>
              ))}
            </div>
        </section>

        {/* Этап 7: Отображение графика */}
        <section className="step step-7">
          <h2>Этап 7. Отображение графика</h2>
          {chartData ? (
            <ChartDisplay chartType={selectedChart} chartData={chartData} />
          ) : (
            <p>Данные для графика еще не загружены.</p>
          )}
        </section>

        <button className="create-chart-button" onClick={saveToAPI}>
          Создать график
        </button>

      </main>
    </div>
  );
}

export default Constructor;
