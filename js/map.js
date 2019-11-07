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
  constructor(data, updateYear) {
    this.museumData = data.geoData;
    this.countryData = data.countryCodes;

    this.updateYear = updateYear;

    this.activeYear = null;
    this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);

    console.log("WorldMap:", data);

  }

  drawMap(world) {
    console.log("world", world)
    let that = this;

    let svg = d3.select("svg#map-chart");
    svg.attr("height", 500).attr("width", 800);

    let height = parseInt(svg.attr("height"));
    let width = parseInt(svg.attr("width"));
    let path = d3.geoPath().projection(this.projection);


    //------CONVERT DATA TO GEOJSON--------
    let geojson = topojson.feature(world, world.objects.countries);
    // console.log("GeoJSON", geojson);

    //---CLEAN UP DATA----
    let countryData = geojson.features.map(country => {
      let index = "temp"; //todo
      let region = 'countries';

      for (let i = 0; i < this.countryData.length; i++) {
        if (this.countryData[i].code == country.id) {
          region = this.countryData[i].country;
        }
      }

      //TODO not if statement needs cleaned up
      if (index > -1) {
        region = this.countryData[index].region;
        return new CountryData(country.type, country.id, country.properties, country.geometry, region);
      } else {
        return new CountryData(country.type, country.id, country.properties, country.geometry, region);
      }

    });

    // console.log(this.museumData);
    // console.log("CountryData", countryData);

    // Draw the background (country outlines; hint: use #map-chart)
    //-----------ADD DATA TO SVG-------------
    let worldMap = svg.selectAll("path")
      .data(countryData)
      .join("path")
      .attr("d", path)
      .classed("countries", true)
      .attr("id", d => d.region)
      .attr("class", function(d) {
        // return d === null ?
        //   "countries" : d.region
        return "countries"
      })
      .classed("boundary", true);

    // for(var i = 0; i < this.museumData.length; i++) {
    //     // console.log(this.museumData[i]);
    //     let country = this.museumData[i].country;
    // }


    let graticule = d3.geoGraticule();
    svg.append('path').datum(graticule).attr('class', "graticule").attr('d', path);
    svg.attr("class", "boundary")

    let circle = ({
      type: "Sphere"
    });
    svg.append("path").datum(circle)
      .attr("id", "outline")
      .attr("d", path);

    //Add Museum Data to Map! TODO: needs work



    //Create the slider
    this.activeYear = 2000; //TODO
    let view = d3.selectAll('.column');
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
      console.log("here", this.value);
      // that.updatePlot(this.value, that.xIndicator, that.yIndicator, that.circleSizeIndicator);

      that.updateYear(this.value);

      sliderText.text(this.value).attr('x', yearScale(this.value));
    });


    this.drawMuseum("canada-science-and-technology-museums", world)
  };

  drawMuseum(museum, world) {
    let selectedMuseumData = this.museumData.filter(d => d.museum === museum && d.acquisition_date === this.updateYear)
    console.log(selectedMuseumData)

    //add bubbles to the countries
    svg.append("g")
      .attr("class", "bubble")
      .selectAll("circle")
      .data(topojson.feature(world, world.objects.countries).features
        .sort(function(a, b) {
          return b.properties.population - a.properties.population;
        }))
      .enter().append("circle")
      .attr("transform", function(d) {
        return "translate(" + path.centroid(d) + ")";
      })
      .attr("r", function(d) {
        return radius(d.properties.population);
      });


  }

}