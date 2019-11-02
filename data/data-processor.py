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

def main():
    # set max size of row
    csv.field_size_limit(sys.maxsize)

    file_dict = {}

    # read in all csv files and store them in a dictionary
    for file in sorted(glob.glob("./raw-data/*-*.csv")):
        museum_name = extractMuseum(file)
        file_dict[museum_name] = file

    # remove csv if it already exists and then create it
    try:
        os.remove("cleaned-data.csv")
    except OSError:
        pass
    out = csv.writer(open("cleaned-data.csv", "w"))

    # add header to csv file
    out.writerow(['museum', 'artifact_name', 'countr_of_origin', 'acquisition_date', 'created_date', 'description', 'continent'])

    # processCanada(file_dict['canada-science-and-technology-museums'], out)
    # processCleveland(file_dict['cleveland-museum-of-art'], out)
    processCoopHew(file_dict['cooper-hewitt-smithsonian-design-museum'], out)

    # printHead(5)

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
                possbile_row = [row[j] for j in column_args[museum_name]]
                if '' in possbile_row:
                    print('missing vals')
                else:
                    print(possbile_row)

'''
Function to process the canada science and technology museums dataset
'''
def processCanada(file, out):
    museum_name = extractMuseum(file)
    reader = csv.reader(open(file, 'rU'), delimiter = '|')
    
    for i, row in enumerate(reader):
        if i > 0: # skips header row of csv file
            try: 
                possbile_row = [row[j] for j in column_args[museum_name]]
            except:
                # row isnt populated enough
                pass
            
            if '' not in possbile_row and possbile_row[1] != 'Unknown': # check that row has all necessary data
                # extract acquisition date
                acq_date = possbile_row[2]
                possbile_row[2] = acq_date[0: acq_date.find('.')]

                # append continent
                try: 
                    possbile_row.append(getContinent(possbile_row[1]))
                except:
                    # country isnt listed 
                    pass


                out.writerow([museum_name] + possbile_row)
                # try:
                #     possbile_row[5]
                #     out.writerow([museum_name] + possbile_row)
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
            possbile_row = [row[j] for j in column_args[museum_name]]

            if '' not in possbile_row:
                # extract country information
                if possbile_row[1].find(',') != -1:
                    possbile_row[1] = (possbile_row[1])[0:(possbile_row[1]).find(',')]

                # extract acquisition year
                acq_date = possbile_row[2]
                possbile_row[2] = acq_date[0: acq_date.find('.')]

                # append continent
                try: 
                    possbile_row.append(getContinent(possbile_row[1]))
                except:
                    # country isnt listed 
                    pass


                out.writerow([museum_name] + possbile_row)
            
'''
Function to process the cooper-hewitt dataset
'''
def processCoopHew(file, out):
    museum_name = extractMuseum(file)
    reader = csv.reader(open(file, 'rU'))

    for i, row in enumerate(reader):
        if i > 0: # skips header row of csv file
            possbile_row = [row[j] for j in column_args[museum_name]]

            if '' not in possbile_row:
                # process created_date
                if 'ca' in possbile_row[3] and len(possbile_row[3]) > 8: # handles circa qualifier, which corresponds with an encoding bug
                    possbile_row[3] = None
                elif 'ca' in possbile_row[3] and len(possbile_row[3]) == 8: # handles circa without endoding errors
                    possbile_row[3] = (possbile_row[3])[(possbile_row[3]).find(' ')]
                elif len(possbile_row[3]) == 4 and possbile_row[3].isdigit():
                    pass
                else:
                    possbile_row[3] = None

                # append continent
                try: 
                    possbile_row.append(getContinent(possbile_row[1]))
                except:
                    # country isnt listed 
                    pass

                out.writerow([museum_name] + possbile_row)



'''
A helper function that retrieves the continent that a country belondgs to
'''
def getContinent(country):
    country_code  = pc.country_name_to_country_alpha2(country, cn_name_format="default")
    return pc.country_alpha2_to_continent_code(country_code)

if __name__ == "__main__":
    main()