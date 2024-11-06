import psycopg2
from psycopg2 import Error

try:
    connection = psycopg2.connect(user="acrywxrk",
                                  password="wxrkacry",
                                  host="dashboard-test-acrywxrk.db-msk0.amvera.tech",
                                  port="5432",
                                  database="testdashboard")

except (Exception, Error) as error:
    print("Ошибка при работе с PostgreSQL", error)