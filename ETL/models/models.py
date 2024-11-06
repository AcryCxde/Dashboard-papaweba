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


class Section1Data(BaseModel):
    id = PrimaryKeyField(null=False)

