import csv
import json

with open("data.csv", 'r') as csv_file:
    file = csv.DictReader(csv_file)

    countries = []
    total = []
    women = []
    men = []
    json_dict = {}

    for row in file:
        if (row["SUBJECT"] == "TRY"):
            total.append(row["Value"])
            countries.append(row["LOCATION"])
        if (row["SUBJECT"] == "TRY_MEN"):
            men.append(row["Value"])
        if (row["SUBJECT"] == "TRY_WOMEN"):
            women.append(row["Value"])

    for i in range(len(countries)):
        json_dict[countries[i]] = {"Total": total[i], "Men": men[i], "Women": women[i]}


    with open('jsonfile.json', 'w') as f:
        json.dump(json_dict, f)
