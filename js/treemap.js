
class TreeMap {

  constructor(data, vizCoord) {
    this.museumData = data.geoData;
    this.vizCoord = vizCoord;

    this.museumNames = ["canada-science-and-technology-museums"] //TODO add the rest
  }

  drawTreeMap() {
    console.log("drawing treemap");


    let width = 800;
    let height = 500;

    let svg = d3.select("svg#tree-map");
    svg.attr("height", height).attr("width", width);

    let color = d3.scaleOrdinal(d3.schemeGnBu[9]);

    let format = d3.format(",d");

    let treemap = d3.treemap()
        .size([width, height])
        .round(true)
        .padding(1);


    // console.log(this.museumData);
    let data = this.filterData();
    // let data = this.createJson();

    // d3.csv("data/cleaned-data.csv").then(data => {
    //   // console.log(i, data);
    //
    //  //  data.forEach(function (d, i) {
    //  //    // d.value = +d.value1;
    //  //    // d.value2 = +d.value2;
    //  //    console.log(i);
    //  // });
    //   data = this.filterData(data);
    //   // console.log(data);
    //
    //
    //
    // });

    var root = d3.stratify()
        .id(function(d) { return d.country; })   // Name of the entity (column name is name in csv)
        .parentId(function(d) { return d.parent; })             // Name of the parent (column name is parent in csv)
        (data);
      // root.sum(count(d));                 // Compute the numeric value for each entity

    treemap(root);

    // let cell = svg.selectAll("a")
    //     .data(root.leaves())
    //     .enter().append("a")
    //     .attr("target", "_blank")
    //     .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")");

    //Notice that the fill is dependent on the hierarchy (2 levels up)
    let cell = svg.selectAll("rect").data(root.leaves()).enter()
        .append("rect")
        .attr("id", d => d.country)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d =>  {
            let a = d.ancestors();
            return color(a[a.length - 2].id);
        });

  }

  filterData() {

    let data = [];

    for(let i=0; i < this.museumNames.length; i++) {
      let selectedMuseumData = null;

      let museumName = this.museumNames[i];

      console.log(museumName);
      selectedMuseumData = this.museumData.filter(d => d.museum === museumName);
      // console.log(selectedMuseumData);

      let countries = [];

      let tmp = [];
      for (let country of selectedMuseumData) {
        tmp.push(country.country_code);
      }
      //remove duplicates
      let countrySet = new Set(tmp)
      countries = [...countrySet];

      //Add the parent node
      data.push({
          number: null,
          country: museumName,
          parent: null,});

      //create an object of the countries with the total number of artifacts
      for (let n of countries) {
        // console.log(n);
        let filtData = selectedMuseumData.filter(d => d.country_code === n)
        data.push({
          number: filtData.map(y => y.artifact_name).length,
          country: n,
          parent: museumName
        })
      }
    }

    console.log(data);
    return data;
  }

  createJson() {
    var jsonData = {};


  }


}
