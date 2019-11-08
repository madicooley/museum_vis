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

    console.log(data);

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
    // console.log("GeoJSON", geojson);

    //---CLEAN UP DATA----
    let countryData = geojson.features.map(country => {
      let index = "temp"; //todo
      let region = 'countries';

      for(let i=0; i < this.countryData.length; i++) {
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
    let view = d3.select('#map-chart');
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
        that.updateYear(this.value);
        sliderText.text(this.value).attr('x', yearScale(this.value));
    });

    //Hardcoded values for museum and year
    console.log("The Year Is:", this.activeYear)
    this.drawMuseumColor("canada-science-and-technology-museums", this.activeYear);

  };

  drawMuseumColor(museum, centroids, year) {
    let selectedMuseumData = this.museumData.filter(d => d.museum === museum && +d.acquisition_date == year)
    console.log("Filtered Museum Data", selectedMuseumData)

    //create object of number of artifacts per country
    let countries = []

    for (let country of selectedMuseumData) {
      countries.push(country.country_code)
    }
    //remove duplicates
    let countrySet = new Set(countries)
    countries = [...countrySet]

    let artifacts = []
    //create an object of the countries with the total number of artifacts
    for (let n of countries) {
      let filtData = selectedMuseumData.filter(d => d.country_code === n)
      artifacts.push({
        number: filtData.map(y => y.artifact_name).length,
        country: n
      })
    }
    console.log("ARTIFACTS", artifacts)
    //create scales
    let domainVal = d3.extent(artifacts, d => +d.number)

    let bubbleScale = d3.scaleSqrt()
      .domain(domainVal)
      .range([1, 20])

    let opacityScale = d3.scaleLinear()
      .domain([0, 1000])
      .range([0, 10000])  //TODO
      .nice();

    let svg = d3.select("svg#map-chart");

    // for(var i = 0; i < this.museumData.length; i++) {
    //     let country = this.museumData[i].country_of_origin;
    //     // console.log(country);
    //
    //
    //
    //     // console.log(d3.select(country_path).style('fill'));
    //
    //     // change the opacity here
    //     // country_path.style("fill", function (d, index, element) {
    //     //     console.log(element[index].style.fill);
    //     //   })
    //
    // }

    // let country_path = svg.select("path#"+country)  //Selecting the country's path!
    //         .style("fill", "#FFCA28")
            // .style("opacity", function(d, i) {
            //
            //
            // });

    // add bubbles to the countries
     // svg.append("g")
     //  .attr("class", "bubble")
     //  .selectAll("circle")
     //  .data(artifacts)
     //  .enter()
     //  .append("circle")
     //  .attr("transform", function(d) {
     //    // d.country === "United States of America" ? d.country = "United States" : d.country === "Taiwan" ? d.country = "Japan" : d.country === "Federal Republic of Germany" ? d.country = "Germany" : d.country === "United Kingdom" ? d.country = "United Kingdom of Great Britain and Northern Ireland" : d.country
     //    let selectedCountry = centroids.filter(x => x.country == d.country) //.attr("path")
     //    // let selectedCountry = world.filter(x => x.region === d.country)
     //    console.log("SELECTED COUNTRY", d.country)
     //
     //    return "translate(" + selectedCountry[0].centroid + ")"
     //  })
     //  .attr("r", d => bubbleScale(d.number))
     //  .style("fill", "rgba(35, 29, 150, 0.70)")
  }


}
