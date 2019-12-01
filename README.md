# museum_vis
Visualization for Data Science (CS ) final project.


README - The README file must give an overview of what you are handing in: which parts are your code, which parts are libraries, and so on. The README must contain URLs to your project websites and screencast videos. The README must also explain any non-obvious features of your interface.




## Directory Structure:

```.
├── bulma.css
├── data
│   ├── cleaned-data.csv
│   ├── concat-data.csv
│   ├── data-exploration.html
│   ├── data-exploration.Rmd
│   ├── data_init.py
│   ├── data-processor.py
│   ├── demonyms.csv
│   ├── museum-bio.csv
│   ├── raw-data
│   │   ├── canada-science-and-technology-museums.csv
│   │   ├── cleveland-museum-of-art.csv
│   │   ├── cooper-hewitt-smithsonian-design-museum.csv
│   │   ├── metropolitan-museum-of-art.csv
│   │   ├── minneapolis-institute-of-art
│   │   │   ├── 0
│   │   │   │   ├── 0.json

 ....

│   │   │       └── 99998.json
│   │   ├── museum-of-modern-art.csv
│   │   └── penn-museum.csv
│   ├── temp_data.csv
│   └── world.json
├── datavis_project_proposal.pdf
├── index.html
├── js
│   ├── kdePlot.js
│   ├── map.js
│   ├── museumTabs.js
│   ├── portraits.js
│   ├── script.js
│   ├── treemap.js
│   ├── vizCoordinator.js
│   └── yearBrush.js
├── legend.png
├── Process-Book.pdf
├── README.md
└── viz.html
```

## Organization
### HTML
index.html: This is the landing page for our project. We wanted to seperate out the video and other requirements from the project to preserve the formatting and layout of Museum+Vis.

vis.html: This is the html to Museum+Vis.

### CSS
bulma.css: This is our style sheet. It is a combination of styles from [Bulma CSS](https://bulma.io/) (a CSS framework built on Flexbox and was used solely for layout) and our customized CSS. 

### JS
script.js: This files loads and processes the data. It also creates the VizCoordinator class.

vizCoordinator.js: This file contains the class responsible for updating all the classes and shared variables across the classes.

### Data
world.json: the shapefile data used in map.js

cleaned-data.csv: the museum data cleaned and compiled from different sources

museum-bio.csv: manually collected information about each museum

## Visualization Classes
kdePlot.js: This file contains the class responsible for creating and updating the KDE Plot and KDE legend.

map.js: This file contains the class responsible for creating and updating the geographic map and circle gylphs.

museumTabs.js: This file contains the class responsible for creating and updating the text about the museums. It also initializes the story buttons and the tutorial for the site. The tutorial is created using [Shepherd.js Library](https://shepherdjs.dev/).

portraits.js: This file contains the class responsible for creating the data portraits of the museums and initializing them as buttons.

treemap.js: This file contains the class responsible for creating and updating the tree map.

yearBrush.js: This file contains the class responsible for creating and updating the year slider.

## Links
Website URL: [https://madicooley.github.io/museum_vis/](https://madicooley.github.io/museum_vis/)

Video URL: 
