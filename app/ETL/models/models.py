from datetime import datetime
from peewee import *

dbhandle = PostgresqlDatabase(
    database='testdashboard',
    user='acrywxrk',
    password='wxrkacry',
    host='dashboard-test-acrywxrk.db-msk0.amvera.tech'
)


class BaseModel(Model):
    class Meta:
        database = dbhandle


class City(BaseModel):
    city = CharField(unique=True)


class Year(BaseModel):
    year = IntegerField(unique=True)

class Section(BaseModel):
    section = IntegerField(unique=True)


class TopHeaders(BaseModel):
    header = CharField()
    section = ForeignKeyField(Section, backref='keys', on_delete='CASCADE')


class SideHeaders(BaseModel):
    header = CharField()
    section = ForeignKeyField(Section, backref='keys', on_delete='CASCADE')


class Data(BaseModel):
    top_header = ForeignKeyField(TopHeaders, backref='keys', on_delete='CASCADE')
    side_header = ForeignKeyField(SideHeaders, backref='keys', on_delete='CASCADE')
    city = ForeignKeyField(City, backref='keys', on_delete='CASCADE')
    year = ForeignKeyField(Year, backref='keys', on_delete='CASCADE')

    section = ForeignKeyField(Section, backref='keys', on_delete='CASCADE')
    value = CharField()


class Users(BaseModel):
    username = CharField()
    password_hash = CharField()


class NearlyUpload(BaseModel):
    username = ForeignKeyField(Users, backref='keys', on_delete='CASCADE')
    count_of_tables = IntegerField()
    datetime = DateTimeField(default=datetime.now)


