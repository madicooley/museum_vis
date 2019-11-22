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

        this.height = 600;
        this.width = 1000;
        this.margins = {'left': 35, 'right': 35, 'top': 25, 'bottom': 35};

        this.xScale = null;
        this.yScale = null;
        this.colorScale = null;
        this.museumNames = [];
    }

    /**
    *  function to initialize the KDE Plot
    */
    initKdePlot(){
        // initialize svg and group that we will append plot elements to
        let svg = d3.select('#kde-plot');
        svg.attr('height', this.height + this.margins.top + this.margins.bottom)
            .attr('width', this.width + this.margins.left + this.margins.right);
        let plotGroup = svg.append('g')
            .attr('id', 'plot-group');

        // initialize groups that we will append axes to
        plotGroup.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${this.margins.left},${this.height-this.margins.bottom})`);
        plotGroup.append('g')
            .attr('id', 'y-axis')
            .attr('transform', `translate(${this.margins.left},${this.margins.top})`);

        // initialize group that we will append actual KDE plots to
        plotGroup.append('g')
            .attr('id', 'kdes')
            .attr('transform', `translate(${this.margins.left},${this.margins.top})`);

        // extract museum names set from data and store them in museumNames
        for (let museums of this.data) {
            this.museumNames.push(museums.museum);
        }
        let museumsSet = new Set(this.museumNames);
        this.museumNames = [...museumsSet];

        // initialize colorScale using museumNames
        this.colorScale = d3.scaleOrdinal()
            .domain(this.museumNames)
            .range(d3.schemeSet2);

        this.drawKdePlot();
    }

    drawKdePlot(){
        let that = this;

        // determine which attribute we will access for data based on the activeYearOpt
        let attrib = null;
        if(this.vizCoord.activeYearOpt == this.vizCoord.yearOpts[0]){ // if we are looking at year acquired
            attrib = 'acquisition_date';
        }else{
            attrib = 'created_date';
        }

        // set plotData based on activeYearOpt
        if(this.vizCoord.activeYearOpt == this.vizCoord.yearOpts[0]){ // if we are looking at year acquired
            this.plotData = this.data;
        }else if(this.vizCoord.activeYearOpt == this.vizCoord.yearOpts[1]){ // if we are looking at year created (before common era)
            this.plotData = this.data.filter((d) => {
                return +(d.created_date) <= 0;
            });
        }else{ // if we are looking at year created (after common era)
            this.plotData = this.data.filter((d) => {
                return +(d.created_date) > 0;
            });
        }

        // get extrema for scaling
        let extrema = d3.extent(this.plotData, (d) => { 
            return +(d[attrib]); 
        });
        
        // create scales and axis elements
        // x-scale
        this.xScale = d3.scaleLinear()
            .domain(extrema)
            .domain([extrema[0], extrema[1] + 10]) // hacky fix to force fill on KDE to work as intended
            .range([0, this.width])
        d3.select('#x-axis')
            .call(d3.axisBottom(this.xScale));
        // y-scale
        // create bins like what would be in a histogram to use for KDE
        let thresholds = this.xScale.ticks(40) // create 40 bin limits
        let bins = d3.histogram()
            .domain(this.xScale.domain())
            .thresholds(thresholds)(this.plotData.map((d) => d.acquisition_date)) // change this from acquisition date
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length) / this.plotData.length])
            .range([this.height - this.margins.top - this.margins.bottom, 0]);
        d3.select('#y-axis')
            .call(d3.axisLeft(this.yScale).ticks(null, "%"))
            .call(g => g.select(".domain").remove())

        // compute densities for KDE plot
        let densities = [];
        for (let musName of this.museumNames){
            let musDensity =  this.kde(this.epanechnikov(7), thresholds, this.plotData.filter((d) => d.museum == musName).map((d) => d[attrib]));
            densities.push({
                'name': musName,
                'density': musDensity
            });
        }

        // plot KDEs
        let lineGenerator = d3.line()
            .curve(d3.curveBasis)
            .x(d => this.xScale(d[0]))
            .y(d => this.yScale(d[1]))
        d3.select('#kdes')
            .selectAll('path')
            .data(densities)
            .join('path')
            .attr('fill', (d) => this.colorScale(d.name))
            .attr('fill-opacity', 0.05)
            .attr('fill-rule', 'evenodd')
            .attr('stroke', (d) => this.colorScale(d.name))
            .attr('stroke-width', 2)
            .attr('stroke-linejoin', 'round')
            .attr('d', d => lineGenerator(d.density))
            .attr('id', d => d.name);
    }

    // Functions to compute density
    kde(kernel, thresholds, data) {
        return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    }
    epanechnikov(bandwidth) {
        return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }
 }