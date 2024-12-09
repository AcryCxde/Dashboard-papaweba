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
    return {"message": "PAPAWEBA V ZDANII SUCHKI, GOTOVTE HTML, GOOOOOOOOOOOOIDA"}


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    # Здесь вызываются ваши методы обработки файла
    result = f"Файл {file.filename} успешно обработан."
    return {"message": result}

