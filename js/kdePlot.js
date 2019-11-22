/**
 *  Class for the KDE plots of the museums
 */
 class KdePlot {
    /**
    *  constructor for KDE Plots
    */
    constructor(data, vizCoord){
        this.data = data.geoData;
        this.bios = data.museumBios;
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
    *  function to initialize the KDE plot elements
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

        // initialize group that we will append text legened for KDE plots to
        plotGroup.append('g')
            .attr('id', 'kde-legend')
            .attr('transform', `translate(${3/5*this.width + this.margins.left},${this.margins.top})`)

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

    /**
    *  function to draw KDE plots
    */
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
        this.slider_snap(extrema[0], extrema[1])
        
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
            .attr('stroke-width', 3)
            .attr('stroke-linejoin', 'round')
            .attr('opacity', (d) => this.isLight(d.name))
            .attr('d', d => lineGenerator(d.density))
            .attr('id', d => d.name);

        // create legend for KDE plot
        d3.select('#kde-legend')
            .selectAll('circle')
            .data(this.museumNames)
            .join('circle')
            .attr('cx', 10)
            .attr('cy', (d) => this.museumNames.indexOf(d)*25)
            .attr('r', 8)
            .attr('stroke', (d) => this.colorScale(d))
            .attr('stroke-width', 3)
            .attr('fill', (d) => this.colorScale(d))
            .attr('fill-opacity', 0.05)
            .attr('opacity', (d) => this.isLight(d));

        d3.select('#kde-legend')
            .selectAll('text')
            .data(this.bios)
            .join('text')
            .attr('x', 25)
            .attr('y', (d) => 5 + this.museumNames.indexOf(d.museumTag)*25)
            .text((d) => d.museumName)
            .attr('opacity', (d) => this.isLightText(d.museumTag));
    }

    /**
    *  functions to calculate densities for KDE
    */
    kde(kernel, thresholds, data) {
        return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    }
    epanechnikov(bandwidth) {
        return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }

    /**
    *  helper function to assign visibility of KDE lines
    */
    isLight(museum){
        if(this.vizCoord.activeMuseum == null){
            return 1;
        }else if(museum == this.vizCoord.activeMuseum){
            return 1;
        }else{
            return 0.2;
        }
    }

    /**
    *  helper function to assign visibility of KDE lines
    */
    isLightText(museum){
        if(this.vizCoord.activeMuseum == null){
            return 1;
        }else if(museum == this.vizCoord.activeMuseum){
            return 1;
        }else{
            return 0.4;
        }
    }

    slider_snap = function(min, max) {

        var range = [min, max+1]
      
        // set width and height of svg
        var w = 400
        var h = 300
        var margin = {top: 130,
                      bottom: 135,
                      left: 40,
                      right: 40}
      
        // dimensions of slider bar
        var width = w - margin.left - margin.right;
        var height = h - margin.top - margin.bottom;
      
        // create x scale
        var x = d3.scaleLinear()
          .domain(range)  // data space
          .range([0, width]);  // display space
        
        // create svg and translated g
        var svg = d3.select('#activeYear-brush')
            .append('svg')
            .attr('width', w)
            .attr('height', h);
        const g = svg.append('g').attr('transform', `translate(${margin.left}, 0)`)
        
        // draw background lines
        // g.append('g').selectAll('line')
        //   .data(d3.range(range[0], range[1]+1))
        //   .enter()
        //   .append('line')
        //   .attr('x1', d => x(d)).attr('x2', d => x(d))
        //   .attr('y1', 0).attr('y2', height)
        //   .style('stroke', '#ccc')
        
        // labels
        var labelL = g.append('text')
          .attr('id', 'labelleft')
          .attr('x', 0)
          .attr('y', height + 5)
          .text(range[0])
      
        var labelR = g.append('text')
          .attr('id', 'labelright')
          .attr('x', 0)
          .attr('y', height + 5)
          .text(range[1])
      
        // define brush
        var brush = d3.brushX()
          .extent([[0,0], [width, height]])
          .on('brush', function() {
            var s = d3.event.selection;
            // update and move labels
            labelL.attr('x', s[0])
              .text(Math.round(x.invert(s[0])))
            labelR.attr('x', s[1])
              .text(Math.round(x.invert(s[1])) - 1)
            // move brush handles      
            handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
            // update view
            // if the view should only be updated after brushing is over, 
            // move these two lines into the on('end') part below
            svg.node().value = s.map(d => Math.round(x.invert(d)));
            svg.node().dispatchEvent(new CustomEvent("input"));
          })
          .on('end', function() {
            if (!d3.event.sourceEvent) return;
            var d0 = d3.event.selection.map(x.invert);
            var d1 = d0.map(Math.round)
            console.log(d0,d1)
            d3.select(this).transition().call(d3.event.target.move, d1.map(x))
          })
      
        // append brush to g
        var gBrush = g.append("g")
            .attr("class", "brush")
            .call(brush)
      
        // add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
        var brushResizePath = function(d) {
            var e = +(d.type == "e"),
                x = e ? 1 : -1,
                y = height / 2;
            return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
              "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
              "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
        }
      
        var handle = gBrush.selectAll(".handle--custom")
          .data([{type: "w"}, {type: "e"}])
          .enter().append("path")
          .attr("class", "handle--custom")
          .attr("stroke", "#000")
          .attr("fill", '#eee')
          .attr("cursor", "ew-resize")
          .attr("d", brushResizePath);
          
        // override default behaviour - clicking outside of the selected area 
        // will select a small piece there rather than deselecting everything
        // https://bl.ocks.org/mbostock/6498000
        gBrush.selectAll(".overlay")
          .each(function(d) { d.type = "selection"; })
          .on("mousedown touchstart", brushcentered)
        
        function brushcentered() {
          var dx = x(1) - x(0), // Use a fixed width when recentering.
          cx = d3.mouse(this)[0],
          x0 = cx - dx / 2,
          x1 = cx + dx / 2;
          d3.select(this.parentNode).call(brush.move, x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]);
        }
        
        // select entire range
        gBrush.call(brush.move, range.map(x))
    
        return svg.node()
      }

 }