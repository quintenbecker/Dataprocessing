import csv
import json

json_dict = {}

with open("graduation_data.csv") as csv_file:
    file = csv.DictReader(csv_file)

    for row in file:
        print(row[0])
        #     json_dict[row[0]] = {"Time": row[5].lstrip(), "Value": row[6].lstrip()

# with open('jsonfile.json', 'w') as f:
#     json.dump(json_dict, f)
