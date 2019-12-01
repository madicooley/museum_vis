/**
 *  Class for the KDE plots of the museums
 */
class KdePlot {
  /**
   *  constructor for KDE Plots
   */
  constructor(data, vizCoord) {
    this.data = data.geoData;
    this.bios = data.museumBios;
    this.plotData = null; // this is the data that will actually be plotted, based on the selection of if we are looking at year created or acuqired
    this.vizCoord = vizCoord;

    this.height = 600;
    this.width = 1000;
    this.margins = {
      'left': 35,
      'right': 35,
      'top': 25,
      'bottom': 5
    };

    this.xScale = null;
    this.yScale = null;
    this.colorScale = null;
    this.museumNames = [];
  }

  /**
   *  function to initialize the KDE plot elements
   */
  initKdePlot() {
    // initialize svg and group that we will append plot elements to
    let svg = d3.select('#kde-plot');
    svg.attr('height', this.height + this.margins.top + this.margins.bottom)
      .attr('width', this.width + this.margins.left + this.margins.right)
    let plotGroup = svg.append('g')
      .attr('id', 'plot-group').call(this.resizeSVG);

    // initialize groups that we will append axes to
    plotGroup.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(${this.margins.left+20},${this.height-this.margins.bottom})`);
    plotGroup.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${this.margins.left+20},${this.margins.top + 100})`);

    // initialize group that we will append actual KDE plots to
    plotGroup.append('g')
      .attr('id', 'kdes')
      .attr('transform', `translate(${this.margins.left},${this.margins.top + 100})`);

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
  drawKdePlot() {
    let that = this;

    // determine which attribute we will access for data based on the activeYearOpt
    let attrib = null;
    if (this.vizCoord.activeYearOpt == this.vizCoord.yearOpts[0].key) { // if we are looking at year acquired
      attrib = 'acquisition_date';
    } else {
      attrib = 'created_date';
    }

    // set plotData based on activeYearOpt
    this.plotData = this.data; // resets plot data
    if (this.vizCoord.activeYearOpt == this.vizCoord.yearOpts[0].key) { // if we are looking at year acquired
      this.plotData = this.data;
    } else if (this.vizCoord.activeYearOpt == this.vizCoord.yearOpts[1].key) { // if we are looking at year created (before common era)
      this.plotData = this.data.filter((d) => {
        return +(d[attrib]) <= 0;
      });
    } else { // if we are looking at year created (after common era)
      this.plotData = this.data.filter((d) => {
        return +(d[attrib]) > 0;
      });
    }
    // filter plotData based on active year range
    this.plotData = this.plotData.filter((d) => {
      return +(d[attrib]) >= this.vizCoord.activeYearRange[0] && +(d[attrib]) <= this.vizCoord.activeYearRange[1]
    });

    // get extrema for scaling and create slider
    let extrema = d3.extent(this.plotData, (d) => {
      return +(d[attrib]);
    });


    // create scales and axis elements
    // x-scale
    this.xScale = d3.scaleLinear()
      .domain(extrema)
      .domain([extrema[0], extrema[1]]) // hacky fix to force fill on KDE to work as intended
      .range([0, this.width])
    d3.select('#x-axis')
      .call(d3.axisBottom(this.xScale)
        .tickFormat(d3.timeFormat("%Y")));
    // y-scale
    // create bins like what would be in a histogram to use for KDE
    let thresholds = this.xScale.ticks(40) // create 40 bin limits
    let bins = d3.histogram()
      .domain(this.xScale.domain())
      .thresholds(thresholds)(this.plotData.map((d) => d.acquisition_date)) // change this from acquisition date
    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) / this.plotData.length])
      // .range([this.height - this.margins.top - this.margins.bottom, this.margins.top]);
      .range([(this.height - this.margins.top - this.margins.bottom - 100), this.margins.top])
    d3.select('#y-axis')
      .call(d3.axisLeft(this.yScale).ticks(null, "%"))
      .call(g => g.select(".domain").remove())
    // .attr("transform", "translate(50,0)")

    // compute densities for KDE plot
    let densities = [];
    for (let musName of this.museumNames) {
      let musDensity = this.kde(this.epanechnikov(7), thresholds, this.plotData.filter((d) => d.museum == musName).map((d) => d[attrib]));
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
      .attr('fill', 'none')
      // .attr('fill', (d) => this.colorScale(d.name))
      // .attr('fill-opacity', 0.05)
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
      .attr('cy', (d) => this.museumNames.indexOf(d) * 25)
      .attr('r', 8)
      .attr('stroke', (d) => this.colorScale(d))
      .attr('stroke-width', 3)
      .attr('fill', (d) => this.colorScale(d))
      .attr('fill-opacity', 0.05)
      .attr('opacity', (d) => this.isLight(d));

    d3.select('#kde-legend')
      .selectAll('text')
      .data(this.bios) //was this.bios
      .join('text')
      .attr('x', 25)
      .attr('y', (d, i) => {
        // console.log("d is:", d)
        return 4 + i * 27
      }) //this.museumNames.indexOf(d.museumTag) * 25)
      .text((d) => d.museumName)
      .attr('opacity', (d) => this.isLightText(d.museumName));

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
  isLight(museum) {
    if (this.vizCoord.activeMuseum == null || "global") {
      return 1;
    } else if (museum == this.vizCoord.activeMuseum) {
      return 1;
    } else {
      return 0.2;
    }
  }

  /**
   *  helper function to assign visibility of KDE lines
   */
  isLightText(museum) {
    // console.log("Selected museum", museum)
    // console.log("activeMuseum", this.vizCoord.activeMuseum)
    if (this.vizCoord.activeMuseum == null || "global") {
      return 1;
    } else if (museum == this.vizCoord.activeMuseum) {
      return 1;
    } else {
      return 0.4;
    }
  }

  // make responsive
  resizeSVG(svg) {
    let that = this
    // get container + svg aspect ratio
    let container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

    svg.attr("viewBox", "0 0 " + width + " " + height)
      .attr("perserveAspectRatio", "xMinYMid")
      .call(resize);

    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
      let targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
    }
  }
}