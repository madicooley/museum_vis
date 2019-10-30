'''
Data Processing for MuseumViz Project

Authors: Derya Akbaba, Madi Cooley, and Cole Polychronis
'''

# import relevant modules
import os
import glob

def main():
    for file in sorted(glob.glob("./raw-data/*-*.csv")):
        print(file)

if __name__ == "__main__":
    main()