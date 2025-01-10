from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173"
]


app.add_middleware(
    CORSMiddleware, # noqa
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
@app.get("/")
async def root():
    return {"message": "PAPAWEBA V ZDANII SU4KI, GOTOVTE HTML, GOOOOOOOOOOOOIDA"}

@app.get("/upload_files")
async def upload_files():
    x = "D:\Рабочий стол\Примеры\Свердловская область 73 МО 2023\Свердловская область 73 МО 2023\ЕКАТЕРИНБУРГ 2023.xlsm"
    return upload_files