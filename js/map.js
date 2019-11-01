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
  constructor(data) {
    this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
  }

  drawMap(world) {
    let svg = d3.select("svg#map-chart");
    let height = parseInt(svg.attr("height"));
    let width = parseInt(svg.attr("width"));
    let path = d3.geoPath()
      .projection(this.projection);


    //------CONVERT DATA TO GEOJSON--------
    let geojson = topojson.feature(world, world.objects.countries);
    console.log("GeoJSON", geojson);

    //---CLEAN UP DATA----
    let countryData = geojson.features.map(country => {

      let index = this.nameArray.indexOf(country.id);
      let region = 'countries';

      if (index > -1) {
        //  console.log(this.populationData[index].geo, country.id);
        region = this.populationData[index].region;
        return new CountryData(country.type, country.id, country.properties, country.geometry, region);
      } else {
        return new CountryData(country.type, country.id, country.properties, country.geometry, region);
        //return null; //console.log('not found')

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
  };


}