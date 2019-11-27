/**
 *  Class that coordinates between the views when the date or selected museum is changed
 */

class VizCoordinator {

    constructor(data){
        this.data = data;
        // default year of 2000, eventually this will be replaced with year range
        this.activeYear = 2000;
        this.activeYearRange = [1995, 2000]; // default year range, currently unused
        this.activeMuseum  = null;
        this.activeCountries = [];

        // initialize views to null
        this.worldMap = null;
        this.museumTabs = null;
        this.dataPortrait = null;
        this.treeMap = null;
        this.kdePlot = null;

    }

    initializeView(){
        this.worldMap = new Map(this.data, this);
        this.worldMap.drawYearSlider();

        this.museumTabs = new MuseumTabs(this.data.museumBios);
        this.museumTabs.drawMuseumTabs();

        this.dataPortrait = new DataPortrait(this.data.geoData, this);
        this.dataPortrait.dataSummary(this.data.geoData);

        this.treeMap = new TreeMap(this.data, this);
        // this.treeMap.drawTreeMap();

        this.kdePlot = new KdePlot(this.data, this);
        this.kdePlot.initKdePlot();
        // this.kdePlot.drawKdePlot();

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

    getTreeMap() {
      return this.treeMap;
    }

    getKdePlot() {
        return this.kdePlot;
    }

    updateYear(newYear){
        this.activeYear = newYear;
    }

    updateYearRange(newRange){ // currently unused
        this.activeYearRange = newRange;
    }

    updateMuseum(newMuseum){
        this.activeMuseum = newMuseum;
    }

    updateCountries(newCountries){
        this.activeCountries = newCountries;
    }

    reDrawViz(){
        console.log('redrawn');
        this.kdePlot.drawKdePlot();
    }
}
