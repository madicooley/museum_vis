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
        let margins = {'left': 35, 'right': 35, 'top': 25, 'bottom': 35}
        let height = 600;
        let width = 1000;

        svg.attr('height', height + margins.top + margins.bottom)
            .attr('width', width + margins.left + margins.right);
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
        let xScale = d3.scaleLinear()
            .domain(extrema).nice()
            .range([0,width])
        plotGroup.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${margins.left},${height-margins.bottom})`)
            .call(d3.axisBottom(xScale));

        // create bins like what would be in a histogram to use for KDE
        let thresholds = xScale.ticks(40) // create 40 bin limits
        let bins = d3.histogram()
            .domain(xScale.domain())
            .thresholds(thresholds)(this.plotData.map((d) => d.acquisition_date)) // change this from acquisition date

        let yScale = d3.scaleLinear() // need to fix this scale
            .domain([0, d3.max(bins, d => d.length) / this.plotData.length])
            .range([height - margins.top - margins.bottom, 0]);
        plotGroup.append('g')
            .attr('id', 'y-axis')
            .attr('transform', `translate(${margins.left},${margins.top})`)
            .call(d3.axisLeft(yScale).ticks(null, "%"))
            .call(g => g.select(".domain").remove())

        // Compute kernel density estimation
        let density = this.kde(this.epanechnikov(7), thresholds, this.plotData.map((d) => d.acquisition_date)) // initial bandwidth = 7

        // Plot bar charts for context
        plotGroup.append("g")
            .attr("fill", "#bbb")
            .selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", d => xScale(d.x0) + 1)
            .attr("y", d => yScale(d.length / this.plotData.length))
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("height", d => yScale(0) - yScale(d.length / this.plotData.length))
            .attr('transform', `translate(${margins.left},${margins.top})`);

        // Plot the area
        let line = d3.line()
            .curve(d3.curveBasis)
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
        plotGroup.append("path")
            .datum(density)
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round')
            .attr('d', line)
            .attr('transform', `translate(${margins.left},${margins.top})`);








        // this.processData(this.data, this.vizCoord.activeYearOpt)
    }

    // Function to compute density
    kde(kernel, thresholds, data) {
        return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    }
    epanechnikov(bandwidth) {
        return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }

    /**
    *  function to process the data in a way that can be used to create the KDE plots
    */
    processData(){

    }
 }