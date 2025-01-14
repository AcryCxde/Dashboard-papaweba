from fastapi import UploadFile
from .extract import extract_section
from .models.models import *

# Кэш для объектов
city_cache = {}
year_cache = {}
section_cache = {}
side_headers_cache = {}
top_headers_cache = {}  # Был список, заменен на словарь


def get_or_create_cached(model, cache, **kwargs):
    key = tuple(kwargs.items())
    if key not in cache:
        obj, created = model.get_or_create(**kwargs)
        cache[key] = obj
    return cache[key]


def get_or_create_sideheader(cache, header, section):
    key = (header, section)  # Формируем ключ для кэша
    if key not in cache:
        # Создаем объект, если его нет в кэше
        obj, created = SideHeaders.get_or_create(header=header, section=section)
        cache[key] = obj  # Сохраняем в кэш
    return cache[key]

def get_or_create_topheader(cache, header, section):
    key = (header, section)  # Формируем ключ для кэша
    if key not in cache:
        # Создаем объект, если его нет в кэше
        obj, created = TopHeaders.get_or_create(header=header, section=section)
        cache[key] = obj  # Сохраняем в кэш
    return cache[key]


async def upload_file(file: UploadFile):
    print("Начали")
    # Определение города и года из имени файла
    file_city = ' '.join(file.filename.split()[:-1])
    file_year = int(file.filename.split()[-1].split('.')[0])

    for section_number in range(1, 7):
        res = extract_section(file.file, section_number)
        res = create_section(res, file_city, file_year, section_number)
        print(res)
        if res == "Section 6 is Done":
            return "Done"
    return "Что то пошло не так"


def create_section(section, city, year, section_number):
    # Получение объектов из кэша или базы данных
    city_obj = get_or_create_cached(City, city_cache, city=city)
    year_obj = get_or_create_cached(Year, year_cache, year=year)
    section_obj = get_or_create_cached(Section, section_cache, section=section_number)

    # Проверка существования заголовков
    side_headers_list = [
        get_or_create_sideheader(side_headers_cache, header=name, section=section_number)
        for name in section['side_headers']
    ]

    top_headers_list = [
        get_or_create_topheader(top_headers_cache, header=name, section=section_number)
        for name in section['top_headers']
    ]

    # Создание данных для пакетной вставки
    data_objects = []
    for row_id, row in enumerate(section['data']):
        for column_id in range(len(row)):
            if value := row[column_id]:
                # Проверка на соответствие индексов
                if row_id < len(side_headers_list) and column_id < len(top_headers_list):
                    data_objects.append(
                        Data(
                            top_header=top_headers_list[column_id],
                            side_header=side_headers_list[row_id],
                            city=city_obj,
                            year=year_obj,
                            section=section_obj,
                            value=value
                        )
                    )
                else:
                    print(f"Warning: Index out of range for row {row_id} and column {column_id}")

    # Пакетная вставка в базу данных
    if data_objects:
        Data.bulk_create(data_objects)

    return f'Section {section_number} is Done'


#print(upload_files(["D:\My Projects\Github\Dashboard\ЕКАТЕРИНБУРГ 2023.xlsm", "D:\My Projects\Github\Dashboard\НИЖНИЙ_ТАГИЛ 2023.xlsx"]))
