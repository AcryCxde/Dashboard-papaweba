from extract import *
from models.models import *

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


def upload_files(files: list):
    for file in files:
        # Определение города и года из имени файла
        file_city = ' '.join(file.split("\\")[-1].split()[:-1])
        file_year = int(file.split("\\")[-1].split()[1].split('.')[0])

        for section_number in range(1, 7):
            res = extract_section(file, section_number)
            res = create_section(res, file_city, file_year, section_number)
            print(res)


def create_section(section, city, year, section_number):
    # Получение объектов из кэша или базы данных
    city_obj = get_or_create_cached(City, city_cache, city=city)
    year_obj = get_or_create_cached(Year, year_cache, year=year)
    section_obj = get_or_create_cached(Section, section_cache, section=section_number)

    # Кэширование заголовков строк и столбцов
    side_headers_list = [
        get_or_create_cached(SideHeaders, side_headers_cache, header=name)
        for name in section['side_headers']
    ]
    top_headers_list = [
        get_or_create_cached(TopHeaders, top_headers_cache, header=name)
        for name in section['top_headers']
    ]

    # Создание данных для пакетной вставки
    data_objects = []
    for row_id, row in enumerate(section['data']):
        for column_id in range(len(row)):
            if value := row[column_id]:
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

    # Пакетная вставка в базу данных
    Data.bulk_create(data_objects)

    return f'Section {section_number} is Done'


print(upload_files(["D:\Рабочий стол\Примеры\Свердловская область 73 МО 2023\Свердловская область 73 МО 2023\ЕКАТЕРИНБУРГ 2023.xlsm"]))
#print(upload_files(["D:\My Projects\Github\Dashboard\ЕКАТЕРИНБУРГ 2023.xlsm", "D:\My Projects\Github\Dashboard\НИЖНИЙ_ТАГИЛ 2023.xlsx"]))
