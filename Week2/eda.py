import csv
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import style
import json

#  open and read through input.csv file as csv_file
if __name__ == "__main__":
    with open("input.csv", 'r') as csv_file:
        file = csv.DictReader(csv_file)
        data_file = []
        json_dict = {}

        # iterate over every row in csv_file and place Country, Region, Inf Mor, Population and GDP in variables
        for row in file:
            country = {}
            country["Country"] = row["Country"].rstrip()
            country["Region"] = row["Region"].rstrip()
            country["Population"] = row["Pop. Density (per sq. mi.)"].rstrip()
            country["Infant mortality"] = row['Infant mortality (per 1000 births)'].rstrip().replace(",", ".")
            gdp_correct = row['GDP ($ per capita) dollars'].rstrip().split(" ")
            country["GDP"] = gdp_correct[0]

            # append these variables to data_file
            data_file.append(country)

            # append variables in a dictonary to json_dict
            json_dict[country["Country"]] = {"Region": country["Region"],
                                            "Population": country["Population"],
                                            "Infant mortality": country["Infant mortality"],
                                            "GDP": country["GDP"]}


        # create Data Frame of data_file
        df = pd.DataFrame(data_file)

        # Select column from dataframe and convert string to integerrs, convert rows with no data to NaN
        GDP = pd.to_numeric(df["GDP"], errors='coerce')
        Inf_mor = pd.to_numeric(df["Infant mortality"], errors='coerce')

        # Calculate the mean, median, mode and standard deviation of the GDP coloumn of the Data Frame
        gdp_mean = GDP.mean()
        gdp_median = GDP.median()
        gdp_mode = GDP.mode().iloc[0]
        gdp_std = GDP.std()

        # Search for the unrealistic data (GDP>60000) and delete from dataframe
        for x, y in enumerate(GDP):
            if y > 60000:
                GDP = GDP.drop(x)

                #Plot an histogram of the GDP data
                plt.hist(GDP, bins=30)
                plt.title("GDP per country")
                plt.xlabel("GDP")
                plt.ylabel("Countries")


        #\ Calculate the first quantile, thirt quantile, minimum, gdp_median
        #  and maximum of the Infant Mortality Column of the Data Frame
        first_quantile = Inf_mor.quantile(.25)
        third_quantile = Inf_mor.quantile(.75)
        minimum = Inf_mor.min()
        maximum = Inf_mor.max()
        median = Inf_mor.median()

        # Plot the  Five Number Summary (data of above) into a boxplot
        Inf_mor.plot.box()
        plt.ylabel("Value per country")

        # create new file with the json_dict converted to a json file
        with open('jsonfile.json', 'w') as f:
            json.dump(json_dict, f)
