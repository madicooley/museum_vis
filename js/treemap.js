
class TreeMap {

  constructor(data, vizCoord) {
    console.log(data);

    this.museumData = data.geoData;
    this.vizCoord = vizCoord;

    this.museumNames = ["canada-science-and-technology-museums", "museum-of-modern-art", "penn-museum",
                        "cleveland-museum-of-art", "cooper-hewitt-smithsonian-design-museum",
                        "metropolitan-museum-of-art", "minneapolis-institute-of-art"]
  }

  drawTreeMap() {
    let width = 800;
    let height = 500;

    let svg = d3.select("svg#tree-map");
    svg.attr("height", height).attr("width", width);

    // let color = d3.scaleOrdinal(d3.schemeGnBu[9]);
    let color = d3.scaleOrdinal(["#b5a5e3", "#b1af00", "#ff5b1a", "#e2a333", "#5b7769", "grey", "#b5a5e3"]);

    let format = d3.format(",d");

    let treemap = d3.treemap()
        .size([width, height])
        .round(true)
        .padding(1);


    let data = this.filterData();

    var root = d3.stratify()
        .id(function(d) { return d.country; })
        .parentId(function(d) { return d.parent; })
        (data)
      .sum(function(d) { return d.number; })
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    treemap(root);

    let cell = svg.selectAll("a")
        .data(root.leaves())
        .enter().append("a")
        .attr("target", "_blank")
        // .attr("xlink:href", d => {
        //     return 1;
        //     // let p = d.data.path.split("/");
        //     // return "https://github.com/" + p.slice(0, 2).join("/") + "/blob/v"
        //             // + version[p[3]] + "/src/" + p.slice(2).join("/");
        // })
        .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")");

    cell.append("rect")
      .attr("id", function(d) { return d.id; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d, i) {
          var a = d.ancestors();
          return color(a[a.length - 2].id);
          // return color[i];
        });

    // cell.append("clipPath")
    //     .attr("id", d => "clip-" + d.id)
    //     .append("use")
    //     .attr("xlink:href", d => "#" + d.id);

    let label = cell.append("text")
        .attr("clip-path", d => "url(#clip-" + d.id + ")");

    label.append("tspan")
        .attr("x", 4)
        .attr("y", 14)
        .attr("font-family", 'Oswald')
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(function(d) {
          if (((d.x1 - d.x0) > 30) && ((d.y1 - d.y0) > 20)) {
            return d.id;
          }
        })

    label.append("tspan")
        .attr("x", 4)
        .attr("y", 24)
        .style("font-size", "10px")
        .attr("font-family", 'Oswald')
        .text(function(d) {
          if (((d.x1 - d.x0) > 30) && ((d.y1 - d.y0) > 20)) {
            return format(d.value);
          }
        });

    cell.append("title")
        .text(function(d) {
            return d.id + "\n" + format(d.value);
        });
  }

  filterData() {

    let data = [];

    //Add root
    data.push({
        number: null,
        country: "ROOT",
        parent: null,});

    for(let i=0; i < this.museumNames.length; i++) {
      let selectedMuseumData = null;

      let museumName = this.museumNames[i];

      // console.log(museumName);
      selectedMuseumData = this.museumData.filter(d => d.museum === museumName);

      let countries = [];

      let tmp = [];
      for (let country of selectedMuseumData) {
        tmp.push(country.country_code);
      }

      //remove duplicates
      let countrySet = new Set(tmp)
      countries = [...countrySet];

      //Add the parent node a.k.a museum parent
      data.push({
          number: null,
          country: museumName,
          parent: "ROOT",});

      //create an object of the countries with the total number of artifacts
      for (let n of countries) {
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

}
