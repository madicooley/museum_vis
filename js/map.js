class CountryData {
  /**
   *
   * @param type refers to the geoJSON type- countries are considered features
   * @param properties contains the value mappings for the data
   * @param geometry contains array of coordinates to draw the country paths
   * @param region the country region
   */
  constructor(type, id, properties, geometry, region) {
    this.type = type;
    this.id = id;
    this.properties = properties;
    this.geometry = geometry;
    this.region = region;
  }
}

class Map {
  /**
   * Test comment
   */
  constructor(data) {
    this.activeYear = null;
    this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);

    console.log(data);
    // this.nameArray = data.population.map(d => d.geo.toUpperCase());;
  }

  drawMap(world) {
    let svg = d3.select("svg#map-chart");
    svg.attr("height", 500).attr("width", 800);

    let height = parseInt(svg.attr("height"));
    let width = parseInt(svg.attr("width"));
    let path = d3.geoPath()
      .projection(this.projection);


    //------CONVERT DATA TO GEOJSON--------
    let geojson = topojson.feature(world, world.objects.countries);
    console.log("GeoJSON", geojson);

    //---CLEAN UP DATA----
    let countryData = geojson.features.map(country => {
      // console.log(country);

      // let index = this.nameArray.indexOf(country.id);
      let index = "temp"; //todo
      let region = 'countries';

      if (index > -1) {
        region = this.populationData[index].region;
        return new CountryData(country.type, country.id, country.properties, country.geometry, region);
      } else {
        return new CountryData(country.type, country.id, country.properties, country.geometry, region);
      }

    });

    // console.log("CountryData", countryData);

    // Draw the background (country outlines; hint: use #map-chart)
    //-----------ADD DATA TO SVG-------------
    let worldMap = svg.selectAll("path")
      .data(countryData)
      .join("path")
      .attr("d", path)
      .classed("countries", true)
      .attr("id", d => d.id)
      .attr("class", function(d) {
        return d === null ?
          "countries" : d.region
      })
      .classed("boundary", true)


    let graticule = d3.geoGraticule();
    svg.append('path').datum(graticule).attr('class', "graticule").attr('d', path);
    svg.attr("class", "boundary")

    let circle = ({
      type: "Sphere"
    });
    svg.append("path").datum(circle)
      .attr("id", "outline")
      .attr("d", path);


    //Create the slider
    this.activeYear = 2000; //TODO
    let view = d3.select('.view');
    view.append('div').attr('id', 'activeYear-bar');

    let yearScale = d3.scaleLinear().domain([1800, 2020]).range([30, 730]);

    let yearSlider = d3.select('#activeYear-bar')
        .append('div').classed('slider-wrap', true)
        .append('input').classed('slider', true)
        .attr('type', 'range')
        .attr('min', 1800)
        .attr('max', 2020)
        .attr('value', this.activeYear)
        .attr("transform", "translate(10,0)");

    let sliderLabel = d3.select('.slider-wrap')
        .append('div').classed('slider-label', true)
        .append('svg');

    let sliderText = sliderLabel.append('text').text(this.activeYear);

    sliderText.attr('x', yearScale(this.activeYear));
    sliderText.attr('y', 25);

    yearSlider.on('input', function() {
        console.log("here");
        // that.updatePlot(this.value, that.xIndicator, that.yIndicator, that.circleSizeIndicator);
        //
        // that.updateYear(this.value);
        //
        // sliderText.text(this.value).attr('x', yearScale(this.value));
    });


    //Create the tab thing?
    view.append("svg").attr('id', 'museumTabContainer');
    let tab = view.select("#museumTabContainer").attr("transform", "translate(200, -400)");

    tab.append("g").attr("id", "museumTextBox")
        .attr("height", 100)
        .attr("width", 100)
        .attr("transform", "translate(10, 10)");

    tab.select("#museumTextBox").append("text").text("Test Title")
        .attr("font-size", "12")
        .attr("font-weight", "Bold")
        .attr("fill", "grey")
        .attr("font-family", "sans-serif")
        .attr("transform", "translate(50, 20)");

    tab.select("#museumTextBox").append("text").text("Test Subtitle")
        .attr("font-size", "12")
        .attr("font-weight", "normal")
        .attr("fill", "grey")
        .attr("font-family", "sans-serif")
        .attr("transform", "translate(50, 40)");

    //Add the circle nav. little things
    tab.append("circle").attr("id", "museumOne").classed("museumCircles", true);
    tab.append("circle").attr("id", "museumTwo").classed("museumCircles", true);
    tab.append("circle").attr("id", "museumThree").classed("museumCircles", true);

    //Add the nav. triagle buttons
    var trianglePoints = 3 + ' ' + 12 + ', ' + 1 + ' ' + 0 + ', ' + 12 + ' ' + 3 + ' ' + 12 + ', ' + 3 + ' ' + 3 + ' ' + 12;

    console.log(trianglePoints);

    tab.append('polyline').attr("id", "museumTriangle")
        .attr('points', trianglePoints)
        .style('fill', 'grey')
        .attr("transform", "translate(40, 105) rotate(75)")
        .attr("rx", 2)
        .attr("ry", 2)
        .on("click", function(d, i) {
            console.log("clicked 1");
        });

    tab.append('polyline').attr("id", "museumTriangle")
        .attr('points', trianglePoints)
        .style('fill', 'grey')
        .attr("transform", "translate(125, 105) rotate(5)")
        .on("click", function(d, i) {
            console.log("clicked 2");
        });

    tab.selectAll(".museumCircles")
      .attr("r", 6)
      .attr("fill", "grey")
      .attr("cx", 10)
      .attr("cy", 10);

    tab.select("#museumOne").attr("transform", "translate(50, 100)");
    tab.select("#museumTwo").attr("transform", "translate(75, 100)");
    tab.select("#museumThree").attr("transform", "translate(100, 100)");

  };



}
