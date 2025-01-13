import peewee
from app.ETL.models.models import *

def reset_tables():
    """Функция для удаления и создания таблиц заново."""
    try:
        dbhandle.connect()

        # Удаляем таблицы
        Data.drop_table()
        SideHeaders.drop_table()
        TopHeaders.drop_table()
        City.drop_table()
        Year.drop_table()
        Users.drop_table()
        Section.drop_table()
        NearlyUpload.drop_table()

        # Создаём таблицы
        City.create_table()
        Year.create_table()
        Section.create_table()
        SideHeaders.create_table()
        TopHeaders.create_table()
        Data.create_table()
        Users.create_table()
        NearlyUpload.create_table()

        return {"success": True, "message": "Таблицы успешно пересозданы"}
    except peewee.InternalError as px:
        return {"success": False, "message": f"Ошибка при пересоздании таблиц: {str(px)}"}
    finally:
        dbhandle.close()
