
class TreeMap {

  constructor(data, vizCoord) {
    console.log(data);
    this.width = 800;
    this.height = 500;

    this.museumData = data.geoData;
    this.vizCoord = vizCoord;

    this.museumNames = ["canada-science-and-technology-museums", "museum-of-modern-art", "penn-museum",
                        "cleveland-museum-of-art", "cooper-hewitt-smithsonian-design-museum",
                        "metropolitan-museum-of-art", "minneapolis-institute-of-art"];

    this.treemap = d3.treemap()
        .size([this.width, this.height])
        .round(true)
        .padding(1);

    this.color = d3.scaleOrdinal(["#b5a5e3", "#b1af00", "#ff5b1a", "#e2a333", "#5b7769", "grey", "#b5a5e3"]);
    this.format = d3.format(",d");

    this.clickNum = {
      clicks: 0
    };

    this.allYears = true;

    this.drawCheckBox();
  }

  drawCheckBox() {
    let that = this;

    var svg = d3.select("svg#check-box")
        .attr("width", 80)
        .attr("height", 50)
        .attr("id", "checkBox")
        // .attr("transform", "translate(5, 20)")
        .attr("transform", "translate(1100, -1150)")
        .on("mouseover", function(d) {
            d3.select(this).style("cursor", "pointer");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("cursor", "default");
        })
        .on("click", function(d, i) {
            if (that.clickNum.clicks % 2 != 0 ) {
                svg.select("#check-mark").attr("fill", "grey");
                that.allYears = true;
                that.drawTreeMap();
            } else {
                svg.select("#check-mark").attr("fill", "white");
                that.allYears = false;
                that.drawTreeMap();
            }
            that.clickNum.clicks = that.clickNum.clicks + 1;
        });

    svg.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("stroke", "grey")
        .attr("fill", "white")
        .attr("transform", "translate(10, 20)");


    svg.append("text")
        .text("All Years")
        .attr("fill", "grey")
        .style("font-size", "14px")
        .attr("font-family", 'Oswald')
        .attr("transform", "translate(25, 32)");


    let checkbox = svg.append("rect")
      .attr("id", "check-mark")
      .attr("width", 8)
      .attr("height", 8)
      .attr("fill", "grey")
      .attr("transform", "translate(12, 22)")

  }

  drawTreeMap() {
    let that = this;

    let svg = d3.select("svg#tree-map");
    svg.attr("height", this.height).attr("width", this.width).attr("transform", "translate(1000, -650)");
    svg.selectAll("a").remove();


    let data = this.filterData();

    var root = d3.stratify()
        .id(function(d) { return d.country; })
        .parentId(function(d) { return d.parent; })
        (data)
      .sum(function(d) { return d.number; })
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    this.treemap(root);

    let cell = svg.selectAll("a").data(root.leaves());

    let container = cell.enter().append("a")
        .attr("target", "_blank")
        .attr("transform", function(d) {
          return "translate(" + d.x0 + "," + d.y0 + ")";
        });

    container.append("rect")
      .attr("id", function(d) { return d.id; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d, i) {
          var a = d.ancestors();
          return that.color(a[a.length - 2].id);
        });

    let label = container.append("text")
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
        });

    label.append("tspan")
        .attr("x", 4)
        .attr("y", 24)
        .style("font-size", "10px")
        .attr("font-family", 'Oswald')
        .text(function(d) {
          if (((d.x1 - d.x0) > 30) && ((d.y1 - d.y0) > 20)) {
            return that.format(d.value);
          }
        });

    container.append("title")
        .text(function(d) {
            let parentName = d.data.parent;
            parentName = parentName.replace(/-/g,' ');
            parentName = parentName.split(" ");

            let mus = '';
            for(let word of parentName) {
              mus = mus + " " + word.charAt(0).toUpperCase() + word.slice(1);
            }

            //TODO needs to display the year interval not just single year
            if (that.allYears != true)  {
              return  mus + "\n" + "acquired " + that.format(d.value) + " artifacts\n" + "from " + d.id + " in " + that.vizCoord.activeYear + ".";
            } else if (that.allYears == true) {
              return  mus + "\n" + "acquired " + that.format(d.value) + " artifacts\n" + "from " + d.id + " from 1995 to 2000."; //TODO correct range??
            }

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

      if (this.allYears == true) {
          selectedMuseumData = this.museumData.filter(d => d.museum === museumName);
      } else {
          selectedMuseumData = this.museumData.filter(d => d.museum === museumName && +d.acquisition_date == this.vizCoord.activeYear);
      }

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

    // console.log(data);
    return data;
  }

}
