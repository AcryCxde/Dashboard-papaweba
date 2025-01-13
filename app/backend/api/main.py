from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from peewee import DoesNotExist, IntegrityError
from passlib.context import CryptContext
from app.ETL.models.models import Users, Section, SideHeaders, TopHeaders, Year, City, Data, NearlyUpload
from app.ETL.operations import reset_tables
from app.ETL.upload_files import upload_file
from typing import Union, List
from pydantic import BaseModel

app = FastAPI()

# Контекст для хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173", # Убедитесь, что ваше приложение работает на этом порту
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "1111"}

# Pydantic-модель для данных пользователя
class User(BaseModel):
    username: str
    password: str

# Функция для создания хеша пароля (например, при регистрации нового пользователя)
def hash_password(password):
    return pwd_context.hash(password)

# Функция для проверки пароля
def verify_password(entered_password, hashed_password):
    return pwd_context.verify(entered_password, hashed_password)

@app.post("/login_verify")
async def login_verify(user: User):
    """Проверка логина пользователя"""
    try:
        # Ищем пользователя в базе данных по имени пользователя
        db_user = Users.get(Users.username == user.username)
    except DoesNotExist:
        # Если пользователь с таким именем не найден
        return JSONResponse(
            status_code=401,
            content={"success": False, "message": "Неверный логин или пароль"}
        )

    # Проверяем пароль
    if not verify_password(user.password, db_user.password_hash):
        return JSONResponse(
            status_code=401,
            content={"success": False, "message": "Неверный логин или пароль"}
        )

    # Если логин и пароль совпадают
    return {"success": True, "message": "Вход выполнен успешно"}

# Эндпоинт для создания нового пользователя
@app.post("/create_user")
async def create_user(user: User):
    """Эндпоинт для создания пользователя"""
    try:
        # Хешируем пароль
        hashed_password = hash_password(user.password)
        # Создаем нового пользователя в базе данных
        new_user = Users.create(username=user.username, password_hash=hashed_password)
        return {"success": True, "message": "Пользователь успешно создан", "user_id": new_user.id}
    except IntegrityError:
        # Если имя пользователя уже существует
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": "Имя пользователя уже занято"}
        )

@app.get("/reset_tables")
async def reset_tables_endpoint():
    """Эндпоинт для пересоздания таблиц"""
    result = reset_tables()
    if result["success"]:
        return JSONResponse(status_code=200, content=result)
    else:
        return JSONResponse(status_code=500, content=result)


# Модель данных для валидации входящего тела запроса
class ChartRequest(BaseModel):
    chartType: str
    section: str
    topParam: Union[str, List[str]]  # Можем получать как строку, так и список строк
    sideParam: Union[str, List[str]]  # То же для бокового параметра
    year: Union[str, List[str]]       # То же для года
    city: Union[str, List[str]]       # То же для города

@app.post("/create-chart")
async def create_chart(data: ChartRequest):
    # Вывод данных в консоль
    top_params = data.topParam if isinstance(data.topParam, list) else [data.topParam]
    side_params = data.sideParam if isinstance(data.sideParam, list) else [data.sideParam]
    years = data.year if isinstance(data.year, list) else [data.year]
    cities = data.city if isinstance(data.city, list) else [data.city]

    top_headers_id = [TopHeaders.get_or_none(TopHeaders.header == top_param).id for top_param in top_params]
    side_headers_id = [SideHeaders.get_or_none(SideHeaders.header == side_param).id for side_param in side_params]
    years_id = [Year.get_or_none(Year.year == year).id for year in years]
    cities_id = [City.get_or_none(City.city == city).id for city in cities]
    section = Section.get_or_none(Section.section == data.section).id

    # Список всех идентификаторов
    lists = [top_headers_id, side_headers_id, years_id, cities_id]

    # Подсчет списков с более чем одним элементом
    count_more_than_one = sum(1 for lst in lists if len(lst) > 1)

    # Проверка условия
    if count_more_than_one > 1:
        raise HTTPException(status_code=422, detail="Ошибка: два или более списков имеют больше одного элемента.")
    elif len(side_headers_id) > 1:
        values = []
        for side_header_id in side_headers_id:
            query = (
                Data.select()
                .where(
                    (Data.section == section) &
                    (Data.top_header == top_headers_id[0]) &
                    (Data.side_header == side_header_id) &
                    (Data.year == years_id[0]) &
                    (Data.city == cities_id[0])
                )
            )
            try:
                result = query.get().value
                values.append(result)
            except DoesNotExist:
                print("Запись не найдена.")
        return {
            'top_headers': top_params[0],
            'side_headers': side_params,
            "values": values,
            'year': years[0],
            'city': cities[0],
        }
    elif len(top_headers_id) > 1:
        values = []
        for top_header_id in top_headers_id:
            query = (
                Data.select()
                .where(
                    (Data.section == section) &
                    (Data.top_header == top_header_id) &
                    (Data.side_header == side_headers_id[0]) &
                    (Data.year == years_id[0]) &
                    (Data.city == cities_id[0])
                )
            )
            try:
                result = query.get().value
                values.append(result)
            except DoesNotExist:
                print("Запись не найдена.")
        return {
            'top_headers': top_params,
            'side_headers': side_params[0],
            "values": values,
            'year': years[0],
            'city': cities[0],
        }
    elif len(years_id) > 1:
        values = []
        for year_id in years_id:
            query = (
                Data.select()
                .where(
                    (Data.section == section) &
                    (Data.top_header == top_headers_id[0]) &
                    (Data.side_header == side_headers_id[0]) &
                    (Data.year == year_id) &
                    (Data.city == cities_id[0])
                )
            )
            try:
                result = query.get().value
                values.append(result)
            except DoesNotExist:
                print("Запись не найдена.")
        return {
            'top_headers': top_params[0],
            'side_headers': side_params[0],
            "values": values,
            'year': years,
            'city': cities[0],
        }
    elif len(cities_id) > 1:
        values = []
        for city_id in cities_id:
            query = (
                Data.select()
                .where(
                    (Data.section == section) &
                    (Data.top_header == top_headers_id[0]) &
                    (Data.side_header == side_headers_id[0]) &
                    (Data.year == years_id[0]) &
                    (Data.city == city_id)
                )
            )
            try:
                result = query.get().value
                values.append(result)
            except DoesNotExist:
                print("Запись не найдена.")
        return {
            'top_headers': top_params[0],
            'side_headers': side_params[0],
            "values": values,
            'year': years[0],
            'city': cities,
        }

@app.get("/dropdown-options/section")
async def get_section():
    return {"data": [
        'Раздел 1. Кадры и человек',
        'Раздел 2. Физкультурно-оздоровительная работа',
        'Раздел 3. Спортивная инфраструктура',
        'Раздел 4. Финансирование физической культуры и спорта',
        'Раздел 5. Развитие видов спорта и двигательной активности',
        'Раздел 6. Социально ориентированные некоммерческие организации (СОНКО)'
    ]}

@app.get("/dropdown-options/sideParam/{section_number}")
async def get_side_param(section_number: int):
    query = SideHeaders.select(SideHeaders.header).where(SideHeaders.section == section_number)
    results = query.dicts()  # Преобразуем результаты в словари
    data = [result['header'] for result in results]  # Извлекаем поле `header`

    if not data:
        raise HTTPException(status_code=404, detail="No data found")

    return {"data": data}

@app.get("/dropdown-options/topParam/{section_number}")
async def get_top_param(section_number: int):
    query = TopHeaders.select(TopHeaders.header).where(TopHeaders.section == section_number)
    results = query.dicts()  # Преобразуем результаты в словари
    data = [result['header'] for result in results]  # Извлекаем поле `header`

    if not data:
        raise HTTPException(status_code=404, detail="No data found")

    return {"data": data}


@app.get("/dropdown-options/year")
async def get_year():
    query = Year.select(Year)
    results = query.dicts()  # Преобразуем результаты в словари
    data = [result['year'] for result in results]

    if not data:
        raise HTTPException(status_code=404, detail="No data found")
    return {"data": data}

@app.get("/dropdown-options/city")
async def get_city():
    query = City.select(City)
    results = query.dicts()  # Преобразуем результаты в словари
    data = [result['city'] for result in results]

    if not data:
        raise HTTPException(status_code=404, detail="No data found")
    return {"data": data}

@app.post("/upload-tables")
async def upload_tables(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        result = await upload_file(file)
        print(result)
        results.append({"filename": file.filename, "status": result})
    NearlyUpload(username=Users.get_or_none(Users.id == 1), count_of_tables=len(files)).save()
    return JSONResponse(content={"results": results})

@app.get('/nearly_tables')
async def get_nearly_tables():
    # Получаем все записи из NearlyUpload с объединением с Users
    all_info = (NearlyUpload
                 .select(NearlyUpload, Users.username)
                 .join(Users))

    # Формируем список словарей для отправки на фронт
    result = []
    for upload in all_info:
        result.append({
            'username': upload.username.username,  # Получаем имя пользователя
            'count_of_tables': upload.count_of_tables,
            'datetime': upload.datetime.strftime('%Y-%m-%d %H:%M:%S')  # Преобразуем дату в строку
        })

    return result
