import pandas as pd
from IPython.display import display

# Загрузка данных из конкретного листа
sheet_name = "Раздел1"
df = pd.read_excel("D:\Рабочий стол\Примеры\Свердловская область 73 МО 2023\Свердловская область 73 МО 2023\ЕКАТЕРИНБУРГ 2023.xlsm", sheet_name=sheet_name, header=None)

df.drop([0,1], inplace=True)
df.reset_index(drop=True, inplace=True)

# Выбираем строки 3, 4 и 5 (индексы 2, 3 и 4)
rows_to_fill = df.iloc[0:3]

# Применяем forward fill только к выбранным строкам
rows_to_fill_filled = rows_to_fill.ffill()

# Обновляем оригинальный DataFrame
df.iloc[0:3] = rows_to_fill_filled

df.drop([0,1,3], inplace=True)

df.rename(columns=df.iloc[0].str.replace('\n',' '), inplace=True)
df = df[1:]
df.reset_index(drop=True, inplace=True)

df1 = df.drop(df.columns[0:2], axis=1)

df2 = pd.DataFrame([df.iloc[:, 0].str.replace('\n',' ').values])

display(df1)
display(df2)



