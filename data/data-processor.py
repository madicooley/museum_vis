'''
Data Processing for MuseumViz Project

Authors: Derya Akbaba, Madi Cooley, and Cole Polychronis
'''

# import relevant modules
import sys
import os
import glob
import csv
from data_init import column_args
import pycountry_convert as pc
import json
import pandas as pd
import numpy as np

def main():
    # set max size of row
    csv.field_size_limit(sys.maxsize)

    file_dict = {}

    # read in all csv files and store them in a dictionary
    for file in sorted(glob.glob("./raw-data/*-*.csv")):
        file_name = extractMuseum(file)
        file_dict[file_name] = file

    # create dictionary to convert nationality 
    country_dict = createDemonyms()

    # remove csv if it already exists and then create it
    try:
        os.remove("concat-data.csv")
        os.remove("cleaned-data.csv")
    except OSError:
        pass
    out = csv.writer(open("concat-data.csv", "w"))

    # add header to csv file
    out.writerow(['museum', 'artifact_name', 'country_of_origin', 'acquisition_date', 'created_date', 'description', 'continent'])

    processCanada(file_dict['canada-science-and-technology-museums'], out)
    processCleveland(file_dict['cleveland-museum-of-art'], out)
    processCoopHew(file_dict['cooper-hewitt-smithsonian-design-museum'], out)
    processMet(file_dict['metropolitan-museum-of-art'], out)
    processMoma(file_dict['museum-of-modern-art'], country_dict, out)
    processPenn(file_dict['penn-museum'], out)
    processMia(out)
    cleanCSV()

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
        for i, row in enumerate(csv.reader(open(file, 'rU'), delimiter = museum_delimitere)):
            if i < rowNum:
                possible_row = [row[j] for j in column_args[museum_name]]
                if '' in possible_row:
                    print('missing vals')
                else:
                    print(possible_row)

'''
Function to process the canada science and technology museums dataset
'''
def processCanada(file, out):
    museum_name = extractMuseum(file)
    reader = csv.reader(open(file, 'rU'), delimiter = '|')
    
    for i, row in enumerate(reader):
        if i > 0: # skips header row of csv file
            try: 
                possible_row = [row[j] for j in column_args[museum_name]]
            except:
                # row isnt populated enough
                pass
            
            if '' not in possible_row and possible_row[1] != 'Unknown': # check that row has all necessary data
                # extract acquisition date
                acq_date = possible_row[2]
                possible_row[2] = acq_date[0: 4]

                # append continent
                try: 
                    possible_row.append(getContinent(possible_row[1]))
                except:
                    # country isnt listed 
                    pass


                out.writerow([museum_name] + possible_row)
                # try:
                #     possible_row[5]
                #     out.writerow([museum_name] + possible_row)
                # except:
                #     # continent no listed for country
                #     pass

'''
Function to process the cleveland museum of art dataset
'''
def processCleveland(file, out):
    museum_name = extractMuseum(file)
    reader = csv.reader(open(file, 'rU'))

    for i, row in enumerate(reader):
        if i > 0: # skips header row of csv file
            possible_row = [row[j] for j in column_args[museum_name]]

            if '' not in possible_row:
                # extract country information
                if possible_row[1].find(',') != -1:
                    possible_row[1] = (possible_row[1])[0:(possible_row[1]).find(',')]

                # extract acquisition year
                acq_date = possible_row[2]
                possible_row[2] = possible_row[2][0: possible_row[2].find('.')]

                # extract created_date
                possible_row[3] = possible_row[3] if float(possible_row[3]) < 2019 else -int(possible_row[3])

                # append continent
                try: 
                    possible_row.append(getContinent(possible_row[1]))
                except:
                    # country isnt listed 
                    pass


                out.writerow([museum_name] + possible_row)
            
'''
Function to process the cooper-hewitt dataset
'''
def processCoopHew(file, out):
    museum_name = extractMuseum(file)
    reader = csv.reader(open(file, 'rU'))

    for i, row in enumerate(reader):
        if i > 0: # skips header row of csv file
            possible_row = [row[j] for j in column_args[museum_name]]

            if '' not in possible_row:
                # process created_date
                if 'ca' in possible_row[3] and len(possible_row[3]) > 8: # handles circa qualifier, which corresponds with an encoding bug
                    possible_row[3] = None
                elif 'ca' in possible_row[3] and len(possible_row[3]) == 8: # handles circa without endoding errors
                    possible_row[3] = (possible_row[3])[(possible_row[3]).find(' ')]
                elif len(possible_row[3]) == 4 and possible_row[3].isdigit():
                    pass
                else:
                    possible_row[3] = None

                # append continent
                try: 
                    possible_row.append(getContinent(possible_row[1]))
                except:
                    # country isnt listed 
                    pass

                out.writerow([museum_name] + possible_row)

'''
Function to process the met museum dataset
'''
def processMet(file, out):
    museum_name = extractMuseum(file)
    reader = csv.reader(open(file, 'rU'))

    for i, row in enumerate(reader):
        if i > 0: # skips header row of csv file
            possible_row = [row[j] for j in column_args[museum_name]]

            if '' not in possible_row:
                # process acquisition date 
                date_str = (possible_row[2])[0:(possible_row[2]).find('.')]
                if(is_number(date_str)):
                    if(len(date_str) == 2): # processes acquisition number with leading 2 digits
                        possible_row[2] = '19' + date_str
                    else: # handles acquisition number with leading 2 digits
                        possible_row[2] = date_str
                else:
                    possible_row[2] = None

                # extract created_date
                possible_row[3] = possible_row[3] if float(possible_row[3]) < 2019 else -int(possible_row[3])

                # append continent
                try: 
                    possible_row.append(getContinent(possible_row[1]))
                except:
                    # country isnt listed 
                    pass

                out.writerow([museum_name] + possible_row)

'''
Function to process the moma dataset
'''
def processMoma(file, country_dict, out):
    museum_name = extractMuseum(file)
    reader = csv.reader(open(file, 'rU'))

    for i, row in enumerate(reader):
        if i > 0: # skips header row of csv file
            possible_row = [row[j] for j in column_args[museum_name]]

            if '' not in possible_row:
                # process country name
                possible_row[1] = possible_row[1][1: len(possible_row[1])-1]
                try:
                    possible_row[1] = country_dict[possible_row[1]]
                except:
                    possible_row[1] = None

                # process acquisition date
                possible_row[2] = possible_row[2][:4]

                # process created date
                if not (is_number(possible_row[3])):
                    possible_row[3] = None

                # append continent
                try: 
                    possible_row.append(getContinent(possible_row[1]))
                except:
                    # country isnt listed 
                    pass

                out.writerow([museum_name] + possible_row)

'''
Function to process the penn-museum dataset
'''
def processPenn(file, out):
    museum_name = extractMuseum(file)
    reader = csv.reader(open(file, 'rU'))

    for i, row in enumerate(reader):
        if i > 0: # skips header row of csv file
            possible_row = [row[j] for j in column_args[museum_name]]

            if '' not in possible_row and is_number(possible_row[2][-4:]):
                # process country name
                if(possible_row[1].isalpha()):
                    pass
                else:
                    possible_row[1] = (possible_row[1])[0:(possible_row[1]).find('|')]
                    if possible_row[1].find('(') > 0:
                        # print((possible_row[1])[0:(possible_row[1]).find('(')-1])
                        possible_row[1] = (possible_row[1])[0:(possible_row[1]).find('(')-1]

                # process acquisition date
                possible_row[2] = possible_row[2][-4:]

                # process creation date
                possible_row[3] = int(possible_row[3]) if is_number(possible_row[3]) else None

                # process data entry error for creation date
                if possible_row[3] > 2019:
                    possible_row[3] = None

                # append continent
                try: 
                    possible_row.append(getContinent(possible_row[1]))
                except:
                    # country isnt listed 
                    pass

                out.writerow([museum_name] + possible_row)

'''
Function to process mia dataset
'''
def processMia(out):
    # for file in sorted(glob.glob("./raw-data/minneapolis-institute-of-art/*/*-*.json")):
    #     print(file)
    for file in sorted(glob.glob("./raw-data/minneapolis-institute-of-art/*/*.json")):
        try:
            json_data = json.load((open(file, 'rU')))
            possible_row = [(json_data[j]).encode("utf-8") for j in column_args['minneapolis-institute-of-art']]

            # process acquisition date
            date_possibilities = [int(s) for s in possible_row[2].split() if s.isdigit()]
            if len(date_possibilities) > 0:
                possible_row[2] = date_possibilities[0]
            else:
                possible_row[2] = None

            # process created date
            if is_number(possible_row[3]):
                possible_row[3] = possible_row[3]
            elif possible_row[3].find('c.') > 0: 
                ind = possible_row[3].find('c.')
                if is_number(possible_row[3][ind+2][ind+6]):
                    possible_row[3] = possible_row[3][ind+2][ind+6]
                elif is_number(possible_row[3][ind+2][ind+5]):
                    possible_row[3] = possible_row[3][ind+2][ind+5]
                else:
                    possible_row[3] = None
            else:
                possible_row[3] = None

            # process country
            if possible_row[1] == 'England' or possible_row[1] == 'Scotland':
                possible_row[1] = 'United Kingdom'

            # process created date
            if not (is_number(possible_row[3])):
                possible_row[3] = None

            # append continent
            try: 
                possible_row.append(getContinent(possible_row[1]))
            except:
                # country isnt listed 
                pass

            out.writerow(['minneapolis-institute-of-art'] + possible_row)
        except:
            pass

        # print(possible_row)
        # break

'''
A helper function that retrieves the continent that a country belondgs to
'''
def getContinent(country):
    country_code  = pc.country_name_to_country_alpha2(country, cn_name_format="default")
    return (pc.country_alpha2_to_continent_code(country_code)) + "_cont"

'''
A helper function to check if strings are numeric
'''
def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

'''
A helper function to create a mapping from nationality to country
'''
def createDemonyms():
    country_dict = {}
    demCsv = csv.reader(open('./demonyms.csv', 'rU'))
    for row in demCsv:
        country_dict[row[0]] = row[1]
    return country_dict

'''
A function to drop missing values and create cleaned-data.csv
'''
def cleanCSV():

    data = pd.read_csv(open('./concat-data.csv', 'rU'), usecols=[0,1,2,3,4,5,6]).dropna()
    # cleans rows that have inaccurately coded dates
    data = data[data.acquisition_date > 1800]
    data = data[data.acquisition_date < 2019]
    data['country_code'] = data.apply(lambda row: getCC(row.country_of_origin), axis = 1)  
    data = data.dropna()  
    
    data.to_csv('cleaned-data.csv', index=False)

'''
Helper function for cleanCSV, which pulls country code for each row
'''
def getCC(country):
    try:
        return pc.country_name_to_country_alpha2(country, cn_name_format = "default")
    except:
        return None

if __name__ == "__main__":
    main()