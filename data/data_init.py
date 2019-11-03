'''
Init file which indidates which cells are to be used for each spreadsheet.
This is represented as a dictionary, with a key of the museum name and a
value of the list of relevant columns.

WARNING: The key must exactly match the museum spreadsheet file name with the
file extension dropped. For example: the key for penn-museum.csv would be
penn-museum

value array represents: 
[artifact name, country, acquisition date, created date, description of artifact]
'''

column_args = {
    'canada-science-and-technology-museums': [1,6,0,9,2],
    'cleveland-museum-of-art': [5,13,1,10,3],
    'cooper-hewitt-smithsonian-design-museum': [24,34,35,2,5],
    'metropolitan-museum-of-art': [5,31,0,22,6],
    'museum-of-modern-art': [0,4,15,8,9],
    'penn-museum': [3,6,12,10,14],
    'minneapolis-institute-of-art': ['title', 'country', 'creditline', 'dated', 'title']

}