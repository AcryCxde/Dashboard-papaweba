
# 1008/ЛКП-8589-2024. Создание системы поддержки принятия управленческих решений (Dashboard) отрасли физической культуры и спорта

## Шаги для запуска проекта

### 1. Установить все зависимости:
```
pip install -r requirements.txt
```

### 2. Запустить бэкенд:
```
cd app/backend/api
uvicorn main:app --reload
```

### 3. Запустить фронтенд:
```
cd app/frontend
npm run dev
```
---

# Архитектура проекта:

### 1. **Источники данных**
   - **Файлы XLSX** с данными (например, статистические отчеты №1-ФК).
   - **Внешние API** — дополнительные источники данных (например, демографическая или экономическая информация).

### 2. **ETL Pipeline**
   - **ETL-инструмент**: **Apache Airflow** или **Talend** для управления процессом загрузки и обработки данных.
     - **Extract**: Извлечение данных из файлов **XLSX**.
     - **Transform**: Преобразование данных в JSON, очистка, подготовка к загрузке.
     - **Load**: Сохранение сырых данных в **NoSQL** (MongoDB) и обработанных — в **реляционную базу данных** (PostgreSQL).

### 3. **NoSQL база данных (MongoDB)**
   - Хранение **неструктурированных сырых данных** в формате JSON.
   - Используется для гибкого хранения данных в исходной форме.

### 4. **Реляционная база данных (PostgreSQL)**
   - Хранение **агрегированных данных** для аналитики и визуализации.
   - Оптимизированная структура для быстрой работы с запросами от фронтенда.

### 5. **Backend API (FastAPI)**
   - Предоставляет **API** для взаимодействия с фронтендом, выполняет запросы данных из реляционной базы и (реже) из NoSQL.
   - Использует **кэширование** (например, Redis) для улучшения производительности при частых запросах к одним и тем же данным.

### 6. **Frontend**
   - **React.js** (или **Vue.js**) для построения интерфейсов пользователя.
   - **D3.js**, **Chart.js**, **Plotly.js**, или **Recharts** для интерактивной визуализации данных.

---

## Процесс работы с данными

1. **Загрузка данных**
   - ETL-инструмент извлекает данные из **XLSX**-файлов, конвертирует их в JSON и очищает для хранения.

2. **Хранение данных**
   - Сырые данные сохраняются в **MongoDB** для гибкости хранения.
   - ETL-пайплайн обрабатывает данные и загружает агрегированные результаты в **PostgreSQL** для аналитики.

3. **Запросы и визуализация**
   - **FastAPI** получает данные из PostgreSQL по запросам от фронтенда.
   - Фронтенд использует полученные данные для построения графиков и диаграмм, предоставляя интерактивный дашборд.

