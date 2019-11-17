/**
 *  Class that coordinates between the views when the date or selected musuem is changed
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
    }

    initializeView(){
        this.worldMap = new Map(this.data, this);
        this.worldMap.drawYearSlider();

        this.museumTabs = new MuseumTabs(this.data.museumBios);
        this.museumTabs.drawMuseumTabs();

        this.dataPortrait = new DataPortrait(this.data.geoData, this.worldMap, this.museumTabs);
        this.dataPortrait.dataSummary(this.data.geoData);
        // const worldMap = new Map(data, updateYear);
        // worldMap.drawYearSlider();
        // const museumTabs = new MuseumTabs(data.museumBios);
        // museumTabs.drawMuseumTabs();
        // const dataPortrait = new DataPortrait(data.geoData, worldMap, museumTabs)
        // dataPortrait.dataSummary(data.geoData);
    }

    updateYear(newYear){
        this.activeYear = newYear;
    }

    updateYearRange(){

    }

    updateMuseum(newMuseum){
        this.activeMuseum = newMuseum;
    }

    updateCountries(newCountries){
        this.activeCountries = newCountries;
    }
}