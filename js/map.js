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
  constructor(data, vizCoord) {
    this.museumData = data.geoData;

    this.vizCoord = vizCoord;

    this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
    this.centroids = [];
  }

  drawMap(world) {
    let that = this;

    let svg = d3.select("svg#map-chart");
    svg.attr("height", 500).attr("width", 800).call(that.resizeSVG);

    let height = parseInt(svg.attr("height"));
    let width = parseInt(svg.attr("width"));
    let path = d3.geoPath().projection(this.projection);


    //------CONVERT DATA TO GEOJSON--------
    let geojson = topojson.feature(world, world.objects.countries);

    //---CLEAN UP DATA----
    let countryData = geojson.features.map(country => {
      let index = "temp"; //todo
      let region = 'none';

      //TODO not if statement needs cleaned up
      if (index > -1) {
        // region = this.countryData[index].region;
        return new CountryData(country.type, country.id, country.properties, country.geometry, region);
      } else {
        return new CountryData(country.type, country.id, country.properties, country.geometry, region);
      }

    });

    // Draw the background (country outlines; hint: use #map-chart)
    //-----------ADD DATA TO SVG-------------

    let worldMap = svg.selectAll("path")
      .data(countryData)
      .join("path")
      .attr("d", path)
      .classed("countries", true)
      .attr("id", d => d.id)
      .attr("class", function(d) {
        that.centroids.push({
          country: d.id,
          centroid: path.centroid(d)
        })
        return "countries"
      })
      .classed("boundary", true);


    let graticule = d3.geoGraticule();
    svg.append('path').datum(graticule).attr('class', "graticule").attr('d', path);
    svg.attr("class", "boundary")

    let circle = ({
      type: "Sphere"
    });
    svg.append("path").datum(circle)
      .attr("id", "outline")
      .attr("d", path);

    // add group that dots will append to
    d3.select('svg#map-chart')
      .append('g')
      .attr('id', 'bubble-group')

    // add div for tooltip
    d3.select('svg#map-chart')
      .append('rect')
      .classed('tooltip', true)

    d3.select('svg#map-chart').attr("transform", "translate(20,0)");
  }

  drawMuseum(museum) {
    let that = this;

    this.vizCoord.updateMuseum(museum);

    let selectedMuseumData = [];
    if (this.vizCoord.activeMuseum == null || this.vizCoord.activeMuseum == 'global') {
      selectedMuseumData = this.museumData;
    } else {
      selectedMuseumData = this.museumData.filter(d => d.museum == museum);
    }
    // console.log('after museum selection: ', selectedMuseumData)

    let attrib = null;
    if (this.vizCoord.activeYearOpt == this.vizCoord.yearOpts[0].key) { // if we are looking at year acquired
      attrib = 'acquisition_date';
    } else {
      attrib = 'created_date';
    }
    selectedMuseumData = selectedMuseumData.filter(d => +d[attrib] >= this.vizCoord.activeYearRange[0] && +d[attrib] <= this.vizCoord.activeYearRange[1])
    //create object of number of artifacts per country
    this.vizCoord.updateCountries([]);

    let tmp = [];
    for (let country of selectedMuseumData) {
      tmp.push(country.country_code);
    }
    //remove duplicates
    let countrySet = new Set(tmp)
    this.vizCoord.updateCountries([...countrySet]);

    let artifacts = []
    //create an object of the countries with the total number of artifacts
    for (let n of this.vizCoord.activeCountries) {
      let filtData = selectedMuseumData.filter(d => d.country_code === n)
      artifacts.push({
        number: filtData.map(y => y.artifact_name).length,
        fullCountryName: filtData.map(y => y.country_of_origin)[0],
        country: n
      })
    }

    //create scales
    let domainVal = d3.extent(artifacts, d => +d.number).map(d => Math.sqrt(d / Math.PI)) // create scale to consider data as area, not radius

    let bubbleScale = d3.scaleLinear()
      .domain(domainVal)
      .range([5, 20])

    let bubbleGroup = d3.select('#bubble-group');

    let bubbles = bubbleGroup
      .selectAll('circle')
      .data(artifacts)
      .join('circle')
      .classed('bubbles', true)
      .attr('transform', (d) => {
        let selectedCountry = that.centroids.filter(x => x.country == d.country)
        if (selectedCountry.length == 0) { // if country not found
          return 'translate(0,0)';
        } else {
          return "translate(" + selectedCountry[0].centroid + ")";
        }
      })
      .on("mouseover", function(d) {
        // console.log(d);
        d3.select(this).append('svg:title')
          // .text(d.number + ' artifacts acquired from ' + d.fullCountryName + " between " + that.vizCoord.activeYear + ".") //TODO add year range
          .text(d.number + " artifacts acquired from " + d.fullCountryName +
            " between\n" + that.vizCoord.activeYearRange[0] + " to " +
            that.vizCoord.activeYearRange[1] + ".")
      })
      .transition()
      .ease(d3.easeLinear)
      .attr("r", d => bubbleScale(Math.sqrt(d.number / Math.PI))) // scale using area, not radius
      .style("fill", "rgba(35, 29, 150, 0.70)")
  }


  drawLegend(min, max) {
    let height = 460
    let width = 460
    let svg = d3.select("#map-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    let size = d3.scaleSqrt()
      .domain([min, max])
      .range([1, 100])

    let valuesToShow = [10, 50, max]
    let xCircle = 230
    let xLabel = 380
    let yCircle = 330


    let legend = svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function(d) {
        return yCircle - size(d)
      })
      .attr("r", function(d) {
        return size(d)
      })
      .style("fill", "none")
      .attr("stroke", "black")

    // Add legend: segments
    legend
      .append("line")
      .attr('x1', function(d) {
        return xCircle + size(d)
      })
      .attr('x2', xLabel)
      .attr('y1', function(d) {
        return yCircle - size(d)
      })
      .attr('y2', function(d) {
        return yCircle - size(d)
      })
      .attr('stroke', 'black')
      .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg
      .append("text")
      .attr('x', xLabel)
      .attr('y', function(d) {
        return yCircle - size(d)
      })
      .text(function(d) {
        return d
      })
      .style("font-size", 10)
      .attr('alignment-baseline', 'middle')
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

} //this is for the class
