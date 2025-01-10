import peewee
from ETL.models.models import *

# Создаём таблицы, необходимо выполнить один раз, либо при изменении полей
if __name__ == '__main__':
    try:
        dbhandle.connect()

        Data.drop_table()
        SideHeaders.drop_table()
        TopHeaders.drop_table()
        City.drop_table()
        Year.drop_table()
        Users.drop_table()
        Section.drop_table()

        City.create_table()
        Year.create_table()
        SideHeaders.create_table()
        TopHeaders.create_table()
        Section.create_table()
        Data.create_table()
        Users.create_table()

    except peewee.InternalError as px:
        print(str(px))
