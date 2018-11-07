#!/usr/bin/env python
# Name: Quinten Joshua Becker
# Student number: 12444057
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup



TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # initialize list
    movie_list = []

    for i in dom.find_all("div", class_ = "lister-item-content"):

        # search for title, rating, year from website
        title = i.h3.a.string
        rating = float(i.div.div.strong.string)
        year = i.h3.find(class_= "lister-item-year text-muted unbold").string
        new_year = year[-5:-1]

        # search for actors and append them to liste
        # then extract all values from list
        actors = i.find_all("p")[2].find_all("a")
        stars = []
        for a in actors:
            if "_st_" in a.get("href"):
                actor = a.string
                stars.append(actor)
        lol = ", ".join(stars)

        # the movie below has no actors, write other code
        if title == "It's Such a Beautiful Day":
            lol = 'No actors'

        runtime = i.find(class_ ="runtime").string
        runtime = runtime[0:3]

        # add all variables to list
        movie_list.extend((title, rating, new_year, lol, runtime))

    return movie_list   


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # write all 5 variables on each row
    for i in range(0, len(movies), 5):
        writer.writerow([movies[i], movies[i+1], movies[i+2], movies[i+3], movies[i+4]])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
