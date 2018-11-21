import csv
import json

with open("KNMI_data.csv", 'r') as csv_file:
    file = csv.DictReader(csv_file)

    json_dict = {}

    for row in file:

        json_dict[row["YYYYMMDD"]] = {"Windspeed (in 0.1 m/s)": int((row["  FHX"]).lstrip())}

with open('jsonfile.json', 'w') as f:
    json.dump(json_dict, f)
