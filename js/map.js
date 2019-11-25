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
    svg.attr("height", 500).attr("width", 800);

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

  };

  drawYearSlider() {
    let that = this;
    let yearScale = d3.scaleLinear().domain([1800, 2020]).range([30, 730]);

    let yearSlider = d3.select('#activeYear-bar')
      .append('div').classed('slider-wrap', true).attr("transform", "translate(20,0)")
      .append('input').classed('slider', true)
      .attr('type', 'range')
      .attr('min', 1800)
      .attr('max', 2020)
      .attr('value', this.vizCoord.activeYear)

    let sliderLabel = d3.select('.slider-wrap')
      .append('div').classed('slider-label', true)
      .append('svg');

    let sliderText = sliderLabel.append('text').text(this.vizCoord.activeYear);

    sliderText.attr('x', yearScale(this.vizCoord.activeYear));
    sliderText.attr('y', 25);

    yearSlider.on('input', function() {

      that.vizCoord.updateYear(this.value);

      sliderText.text(this.value).attr('x', yearScale(this.value));
      if (that.vizCoord.activeMuseum) {
        that.drawMuseum(that.vizCoord.activeMuseum);
        that.vizCoord.treeMap.drawTreeMap();
      }
    });

  }

  drawMuseum(museum) {
    // console.log(museum);
    let that = this;

    this.vizCoord.updateMuseum(museum);
    let selectedMuseumData = this.museumData.filter(d => d.museum === museum && +d.acquisition_date == this.vizCoord.activeYear)
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
        country: n
      })
      // console.log(artifacts)
    }

    //create scales
    let domainVal = d3.extent(artifacts, d => +d.number).map(d => Math.sqrt(d / Math.PI)) // create scale to consider data as area, not radius

    let bubbleScale = d3.scaleLinear()
      .domain(domainVal)
      .range([5, 20])

    let bubbleGroup = d3.select("g#bubble-group");

    let bubbles = bubbleGroup
      .selectAll('circle')
      .data(artifacts)
      .join('circle')
      .classed('bubbles', true)
      .attr('transform', (d) => {
        let selectedCountry = that.centroids.filter(x => x.country == d.country)
        return "translate(" + selectedCountry[0].centroid + ")"
      })
      .on("mouseover", function(d) {
        d3.select(this).append('svg:title')
          .text(d.number + ' artifacts acquired from ' + d.country)
      })
      .transition()
      // .duration(750)
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

} //this is for the class
