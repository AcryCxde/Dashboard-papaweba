from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

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

# Модель User с использованием pydantic для валидации данных
class User(BaseModel):
    login: str
    password: str

@app.post("/login_verify")
async def login_verify(user: User):
    print(f"Полученные данные: {user.login}, {user.password}")
    # Проверка логина и пароля (проверьте, что данные соответствуют введенным в форме)
    if user.login == "pipa" and user.password == "1111":
        return {"success": True}
    else:
        # Более точное сообщение об ошибке
        return JSONResponse(
            status_code=401,
            content={"success": False, "message": "Неверный логин или пароль"}
        )
