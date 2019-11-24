/**
 *  Class that coordinates between the views when the date or selected museum is changed
 */
class VizCoordinator {

    constructor(data){
        this.data = data;
        // default year of 2000, eventually this will be replaced with year range
        this.activeYear = 2000;
        // this.activeYearRange = [1840,2020]; // default year range, currently unused
        this.activeMuseum  = null;
        this.activeCountries = [];

        // dictionary for year range options
        this.yearOpts = [
            {
                'key': 'year-acquired',
                'value': [1840, 2020]
            },
            {
                'key': 'year-created-before-bc',
                'value': [-400000, -1]
            },
            {
                'key': 'year-created-after-bc',
                'value': [1, 2020]
            }
        ]
        this.activeYearOpt = this.yearOpts[0].key;
        this.activeYearRange = this.yearOpts[0].value;
        // const yearOpts = ['year-acquired','year-created-before-bc','year-created-after-bc'];
        // this.yearOpts = yearOpts;
        // this.activeYearOpt = this.yearOpts[2];

        // initialize views to null
        this.worldMap = null;
        this.museumTabs = null;
        this.dataPortrait = null;
        this.kdePlot = null;
        this.yearBrush = null;
    }

    initializeView(){
        this.worldMap = new Map(this.data, this);
        this.worldMap.drawYearSlider();

        this.museumTabs = new MuseumTabs(this.data.museumBios);
        this.museumTabs.drawMuseumTabs();

        this.dataPortrait = new DataPortrait(this.data.geoData, this);
        this.dataPortrait.dataSummary(this.data.geoData);

        this.kdePlot = new KdePlot(this.data, this);
        this.kdePlot.initKdePlot();

        this.yearBrush = new YearBrush(this);
        this.yearBrush.initBrush();
    }

    getWorldMap(){
        return this.worldMap;
    }

    getMuseumTabs(){
        return this.museumTabs;
    }

    getDataPortrait(){
        return this.dataPortrait;
    }

    getKdePlot(){
        return this.kdePlot;
    }

    updateYear(newYear){
        this.activeYear = newYear;
    }

    updateYearRange(newRange){ // currently unused
        console.log(newRange)
        this.activeYearRange = newRange;

        this.reDrawViz();
    }

    updateMuseum(newMuseum){
        this.activeMuseum = newMuseum;

        this.reDrawViz();
    }

    updateCountries(newCountries){
        this.activeCountries = newCountries;
    }

    reDrawViz(){
        console.log('redrawn');
        this.kdePlot.drawKdePlot();
    }
}