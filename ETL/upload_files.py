from extract import *
from models.models import *

top_headers_list = []
side_headers_list = []


def upload_files(files: list):
    for file in files:
        # city, year = file.split()  # todo: после ручки от бека нужно брать file.name

        file_city = ' '.join(file.split("\\")[-1].split()[:-1])
        file_year = int(file.split("\\")[-1].split()[1].split('.')[0])

        for section_number in range(1, 7):
            res = extract_section(file, section_number)

            res = create_section(res, file_city, file_year, section_number)
            print(res)


def create_section(section, city, year, section_number):
    global side_headers_list
    global top_headers_list

    city_obj, is_city_created = City.get_or_create(city=city)
    year_obj, is_year_created = Year.get_or_create(year=year)
    section_obj, is_section_created = Section.get_or_create(section=section_number)

    if not is_city_created:
        city_obj.save()

    if not is_year_created:
        year_obj.save()

    if not is_section_created:
        section_obj.save()

    if is_city_created or is_year_created or is_section_created:
        for side_header_name in section['side_headers']:
            side_header, is_side_created = SideHeaders.get_or_create(header=side_header_name)
            if not is_side_created:
                side_header.save()
            side_headers_list.append(side_header)

        for top_header_name in section['top_headers']:
            top_header, is_top_created = TopHeaders.get_or_create(header=top_header_name)
            if not is_top_created:
                top_header.save()
            top_headers_list.append(top_header)

        for row_id, row in enumerate(section['data']):
            for column_id in range(len(row)):
                if value := row[column_id]:
                    data = Data(
                        top_header=top_headers_list[column_id],
                        side_header=side_headers_list[row_id],
                        city=city_obj,
                        year=year_obj,
                        section=section_obj,
                        value=value
                    )
                    data.save()

    return f'Section {section_number} is Done'


print(upload_files(["D:\Рабочий стол\Примеры\Свердловская область 73 МО 2023\Свердловская область 73 МО 2023\ЕКАТЕРИНБУРГ 2023.xlsm"]))
#print(upload_files(["D:\My Projects\Github\Dashboard\ЕКАТЕРИНБУРГ 2023.xlsm", "D:\My Projects\Github\Dashboard\НИЖНИЙ_ТАГИЛ 2023.xlsx"]))
