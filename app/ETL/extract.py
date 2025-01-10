import json
import pandas as pd


def extract_section(path, section_number):
    """
    Возвращает json боковых ключей и осовной таблицы

    :param path:
    :return:
    """

    sheet_name = f"Раздел{section_number}"

    df = pd.read_excel(path, sheet_name=sheet_name, header=None)
    if section_number in [1,3]:
        top_headers = df[2:5].to_json(orient='values', force_ascii=False)
        data = df[6:].drop([0, 1], axis=1)
        side_headers = df[0][6:]
    else:
        top_headers = df[2:6].to_json(orient='values', force_ascii=False)
        data = df[7:].drop([0, 1], axis=1)
        side_headers = df[0][7:]
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
    cleaned_headers.pop(1)
    top_headers = cleaned_headers

    data = data.to_json(orient='values', force_ascii=False)
    data = json.loads(data)
    data = [sublist for sublist in data if all(item is not None for item in sublist)]

    side_headers = side_headers.to_json(orient='values', force_ascii=False)
    side_headers = json.loads(side_headers)
    side_headers = side_headers[:side_headers.index(None)] if None in side_headers else side_headers
    side_headers = list(item.replace('\n', '') for item in side_headers)

    return {
            'side_headers': side_headers,
            'top_headers': top_headers,
            'data': data,
            }
