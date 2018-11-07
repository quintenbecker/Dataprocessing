#!/usr/bin/env python
# Name: Quinten Joshua Becker
# Student number: 12444057
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
from statistics import mean

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# Open csv file and iterate over every row (movie) and attach ratings to each year
with open('movies.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        year = row['Year']
        rating = row['Rating']
        data_dict[year].append(rating)

    # Calculate avarage rating for each year and append them to the dictionary
    for year in data_dict:
        list = data_dict[year]
        lol = [float(i) for i in list]
        avarage = sum(lol)/ (len(lol))
        data_dict[year] = avarage



# Global dictionary for the data
if __name__ == "__main__":
    print(data_dict)

    # Make plot with keys(years) and values(avarage rating) from dictionary data_dict
    plt.plot(data_dict.keys(), data_dict.values())
    plt.axis([0, 9, 6, 10])
    plt.show()
