import csv
import json

with open("working_pop.csv", 'r') as csv_file:
    file = csv.DictReader(csv_file)

    json_dict = {}

    for row in file:
        if row["LOCATION"] == "NLD":
            json_dict[row["TIME"]] = row["Value"]

with open('jsonfile.json', 'w') as f:
    json.dump(json_dict, f)
