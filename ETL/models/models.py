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

    year = IntegerField(null=False)
    city = CharField(null=False)

class Section1Data(BaseModel):
    id = PrimaryKeyField(null=False)

    # всего
    inTotal = IntegerField(null=False)
    # в сельской местности
    countrysideEmployees = IntegerField(null=False)
    # женщины
    womanEmployees = IntegerField(null=False)
    # кол-во вакансий
    vacancies = IntegerField(null=True)
    # кол-во созданных рабочих мест
    newWorkplaces = IntegerField(null=False)

    class EmployeesType:
        # штатные работники
        regular = IntegerField(null=True)
        # специалисты, впервые приступившие к работе в отчетном периоде
        new = IntegerField(null=False)

    class EmployeesEducation:
        # с высшим образованием
        higherEducation = IntegerField(null=False)
        # со средним образованием
        middleEducation = IntegerField(null=False)

    class EmployeesAge:
        # до 30 лет
        young = IntegerField(null=False)
        # 31-59 лет
        middle = IntegerField(null=False)
        # 60 лет и старше
        old = IntegerField(null=False)

class Section1Keys(BaseModel):
    # внешний ключ, связывающий строку данных с ключом
    section1Data = ForeignKeyField(Section1Data, backref='keys', on_delete='CASCADE')
    # наименование поля
    name = CharField(null=False)