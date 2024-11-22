from extract import *
from models.models import *

top_headers_list = []
side_headers_list = []


def upload_files(files: list):
    for file in files:
        # city, year = file.split()  # todo: после ручки от бека нужно брать file.name

        file_city = file.split("\\")[-1].split()[0]
        file_year = int(file.split("\\")[-1].split()[1].split('.')[0])

        res = extract_all_sections(file)

        return create_section_1(res['section1'], file_city, file_year)


def create_section_1(section, city, year):
    global side_headers_list
    global top_headers_list

    city_obj, is_city_created = City.get_or_create(city=city)
    year_obj, is_year_created = Year.get_or_create(year=year)

    if not is_city_created:
        city_obj.save()

    if not is_year_created:
        year_obj.save()

    print(city_obj, is_city_created)
    print(year_obj, is_year_created)

    if is_city_created or is_year_created:
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
                        value=value
                    )
                    data.save()

    return 'Done'

print(upload_files(["D:\My Projects\Github\Dashboard\ЕКАТЕРИНБУРГ 2023.xlsm"]))
print(upload_files(["D:\My Projects\Github\Dashboard\ЕКАТЕРИНБУРГ 2023.xlsm", "D:\My Projects\Github\Dashboard\НИЖНИЙ_ТАГИЛ 2023.xlsx"]))
