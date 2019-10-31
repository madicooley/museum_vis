'''
Data Processing for MuseumViz Project

Authors: Derya Akbaba, Madi Cooley, and Cole Polychronis
'''

# import relevant modules
import os
import glob
import csv
from data_init import column_args

def main():
    printHead(5)

'''
Function to take a file name and isolate the name of the museum
'''
def extractMuseum(fileName):
    # find last instance of '/' character
    slash_index = fileName.rfind('/') + 1
    # find last instance of '.csv' substring
    fileEXT_index = fileName.rfind('.csv')

    return fileName[slash_index:fileEXT_index]

'''
A helper function that prints the first number of specfied rows from each CSV
'''
def printHead(rowNum):
    for file in sorted(glob.glob("./raw-data/*-*.csv")):
        museum_name = extractMuseum(file)
        museum_delimiter = '|' if museum_name == 'canada-science-and-technology-museums' else ','
        print(museum_name)
        for i, row in enumerate(csv.reader(open(file, 'rU'), delimiter = museum_delimiter)):
            if i < rowNum:
                possbile_row = [row[j] for j in column_args[museum_name]]
                if '' in possbile_row:
                    print('missing vals')
                else:
                    print(possbile_row)


if __name__ == "__main__":
    main()