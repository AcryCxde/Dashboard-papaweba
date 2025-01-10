from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from peewee import DoesNotExist, IntegrityError
from passlib.context import CryptContext
from app.ETL.models.models import Users

app = FastAPI()

# Контекст для хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

origins = [
    "http://localhost:5173",  # Убедитесь, что ваше приложение работает на этом порту
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
