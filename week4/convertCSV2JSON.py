import csv
import json

with open("working_pop.csv", 'r') as csv_file:
    file = csv.DictReader(csv_file)

    json_list = []

    for row in file:
        if row["TIME"] == "2000":
            json_list.append({"country": row["LOCATION"], "value": row["Value"]})

with open('jsonfile.json', 'w') as f:
    json.dump(json_list, f)
