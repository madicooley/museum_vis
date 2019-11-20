/**
 *  Class for the KDE plots of the museums
 */
 class KdePlot {
    /**
    *  constructor for KDE Plots
    */
    constructor(data, vizCoord){
        this.data = data.geoData;
        this.plotData = null; // this is the data that will actually be plotted, based on the selection of if we are looking at year created or acuqired
        this.vizCoord = vizCoord;
    }

    /**
    *  function to initialize the KDE Plot
    */
    drawKdePlot(){
        let that = this;

        // initialize svg and group that we will append plot elements to
        let svg = d3.select('#kde-plot');
        svg.attr('height', 600)
            .attr('width', 1000);
        let plotGroup = svg.append('g')
            .attr('id', 'plot-group');

        // pull out extrema for scaling, based on what the active yearOption is, as well as set the data to be plotted
        this.plotData = this.data;
        let extrema = null;
        if(this.vizCoord.activeYearOpt == this.vizCoord.yearOpts[0]){ // if we are looking at year acquired
            extrema = d3.extent(this.plotData, (d) => { 
                return +(d.acquisition_date); 
            });
        }else if(this.vizCoord.activeYearOpt == this.vizCoord.yearOpts[1]){ // if we are looking at year created (before common era)
            this.plotData = this.data.filter((d) => {
                return +(d.created_date) <= 0;
            });
            extrema = d3.extent(this.plotData, (d) => { 
                return +(d.created_date); 
            });
        }else{ // if we are looking at year created (after common era)
            this.plotData = this.data.filter((d) => {
                return +(d.created_date) > 0;
            });
            extrema = d3.extent(this.plotData, (d) => { 
                return +(d.created_date); 
            });
        }

        // create axis for plot

        // this.processData(this.data, this.vizCoord.activeYearOpt)
    }

    /**
    *  function to process the data in a way that can be used to create the KDE plots
    */
    processData(){

    }
 }