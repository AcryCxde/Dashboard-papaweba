import json
import pandas as pd


def extract_section(file, section_number):
    """
    Возвращает json боковых ключей и основной таблицы.

    :param file: файловый объект (UploadFile.file)
    :param section_number: номер раздела
    :return: словарь с данными
    """
    sheet_name = f"Раздел{section_number}"

    # Чтение Excel-файла из файлового объекта
    df = pd.read_excel(file, sheet_name=sheet_name, header=None)

    if section_number in [1, 3]:
        top_headers = df[2:5].to_json(orient='values', force_ascii=False)
        data = df[6:].drop([0, 1], axis=1)
        side_headers = df[0][6:]
    else:
        top_headers = df[2:6].to_json(orient='values', force_ascii=False)
        data = df[7:].drop([0, 1], axis=1)
        if section_number == 5:
            data = data.iloc[:, 2:15]
        side_headers = df[0][7:]

    # Преобразование верхних заголовков
    top_headers = json.loads(top_headers)
    transposed = list(zip(*top_headers))

    cleaned_headers = []
    for column in transposed:
        header = next(
            (
                " ".join(item.replace('\n', ' ').split())
                for item in reversed(column) if item
            ),
            None
        )
        cleaned_headers.append(header)

    cleaned_headers.pop(0)
    cleaned_headers.pop(0)
    top_headers = cleaned_headers

    # Преобразование данных
    data = data.to_json(orient='values', force_ascii=False)
    data = json.loads(data)
    data = [sublist for sublist in data if all(item is not None for item in sublist)]

    # Преобразование боковых заголовков
    side_headers = side_headers.to_json(orient='values', force_ascii=False)
    side_headers = json.loads(side_headers)
    side_headers = side_headers[:side_headers.index(None)] if None in side_headers else side_headers
    side_headers = list(item.replace('\n', '') for item in side_headers)

    res = {
        'side_headers': side_headers,
        'top_headers': top_headers,
        'data': data,
    }
    return res

