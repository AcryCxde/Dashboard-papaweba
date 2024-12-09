import json

import pandas as pd


def extract_all_sections(path):
    """
    Возвращает json боковых ключей и осовной таблицы

    :param path:
    :return:
    """

    sheet_name = "Раздел1"
    df = pd.read_excel(path, sheet_name=sheet_name, header=None)

    top_headers = df[2:5].to_json(orient='values', force_ascii=False)
    top_headers = json.loads(top_headers)
    top_headers = list(map(lambda x: ''.join(filter(None, x)), zip(*top_headers)))
    top_headers = list(item.replace('\n', '') for item in top_headers)
    top_headers.pop(1)

    data = df[6:].drop([0, 1], axis=1)
    data = data.to_json(orient='values', force_ascii=False)
    data = json.loads(data)

    side_headers = df[0][6:]
    side_headers = side_headers.to_json(orient='values', force_ascii=False)
    side_headers = json.loads(side_headers)
    side_headers = list(item.replace('\n', '') for item in side_headers)

    return {
            'section1': {
                    'side_headers': side_headers,
                    'top_headers': top_headers,
                    'data': data,
                 }
            }
