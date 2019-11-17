/**
 *  Class that coordinates between the views when the date or selected musuem is changed
 */

class VizCoordinator {

    constructor(dataDict){
        this.dataDict = dataDict
        // default year of 2000, eventually this will be replaced with year range
        this.year = 2000;
        this.yearRange = [1995, 2000] // default year range, currently unused
        this.musuem  = null;
    }

    initializeView(){

    }

    updateYear(){

    }

    updateYearRange(){

    }

    updateMuseum(){

    }
}