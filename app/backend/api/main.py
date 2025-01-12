from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from peewee import DoesNotExist, IntegrityError
from passlib.context import CryptContext
from app.ETL.models.models import Users, Section, SideHeaders, TopHeaders, Year, City
from app.ETL.operations import reset_tables  # Импортируем функцию пересоздания таблиц

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
    topParam: str
    sideParam: str
    year: str
    city: str


# Эндпоинт для обработки данных
@app.post("/create-chart")
async def create_chart(data: ChartRequest):
    # Вывод данных в консоль
    print("Полученные данные для создания диаграммы:")
    print(data.dict())

    # Возвращаем успешный ответ
    return {"message": "Данные успешно получены", "data": data.dict()}


@app.get("/dropdown-options/section")
async def get_section():
    return {"data": [
        'Раздел 1. Кадры и человек',
        'Раздел 2. Физкультурно-оздоровительная работа',
        'Раздел 3. Спортивная инфраструктура',
        'Раздел 4. Финансирование физической культуры и спорта'
        'Раздел 5. Развитие видов спорта и двигательной активности',
        'Социально ориентированные некоммерческие организации (СОНКО)'
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
