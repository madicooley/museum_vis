'''
Data Processing for MuseumViz Project

Authors: Derya Akbaba, Madi Cooley, and Cole Polychronis
'''

# import relevant modules
import os
import glob
import csv

def main():
    for file in sorted(glob.glob("./raw-data/*-*.csv")):
        print('Museum: ' + extractMuseum(file))
        # for i, row in enumerate(csv.reader(open(file, "rU"))):
        #     # print(row)

'''
Function to take a file name and isolate the name of the museum

Parameters:
filename: name of the dataset file

Returns:
string: name of the museum
'''
def extractMuseum(fileName):
    # find last instance of '/' character
    slash_index = fileName.rfind('/') + 1
    # find last instance of '.csv' substring
    fileEXT_index = fileName.rfind('.csv')

    return fileName[slash_index:fileEXT_index]


if __name__ == "__main__":
    main()