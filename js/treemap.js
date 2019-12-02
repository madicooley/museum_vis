class TreeMap {

  constructor(data, vizCoord) {
    this.height = 600;
    this.width = 1000;

    this.margins = {
      'left': 35,
      'right': 35,
      'top': 25,
      'bottom': 5
    };

    this.museumData = data.geoData;
    this.vizCoord = vizCoord;

    this.treemap = d3.treemap()
      .size([this.width, this.height])
      .round(true)
      .padding(1);


    this.museumNames = [];
    // extract museum names set from data and store them in museumNames
    for (let museums of this.museumData) {
      this.museumNames.push(museums.museum);
    }
    let museumsSet = new Set(this.museumNames);
    this.museumNames = [...museumsSet];

    // initialize colorScale using museumNames
    this.colorScale = d3.scaleOrdinal()
      .domain(this.museumNames)
      .range(d3.schemeSet2);

    this.format = d3.format(",d");

    this.clickNum = {
      clicks: 0
    };

  }

  drawTreeMap() {
    let that = this;

    let outter = d3.select("svg#tree-map");
    // svg.attr("height", this.height).attr("width", this.width).attr("transform", "translate(0, 0)").call(that.resizeSVG);
    outter.attr('height', this.height + this.margins.top + this.margins.bottom)
      .attr('width', this.width + this.margins.left + this.margins.right).call(that.resizeSVG);

    outter.append('svg').attr('id', 'outter');
    let svg = outter.selectAll('#outter')
      .attr('height', this.height)
      .attr('width', this.width);

    svg.selectAll("a").remove();

    let data = this.filterData();

    var root = d3.stratify()
      .id(function(d) {
        return d.country;
      })
      .parentId(function(d) {
        return d.parent;
      })
      (data)
      .sum(function(d) {
        return d.number;
      })
      .sort(function(a, b) {
        return b.height - a.height || b.value - a.value;
      });

    this.treemap(root);

    let cell = svg.selectAll("a").data(root.leaves());

    let container = cell.enter().append("a")
      .attr("target", "_blank")
      .attr("transform", function(d) {
        return "translate(" + d.x0 + "," + d.y0 + ")";
        // .attr('transform', `translate(${this.margins.left+20},${this.height-this.margins.bottom})`);
      });

    container.append("rect")
      .attr("id", function(d) {
        return d.id;
      })
      .attr("width", function(d) {
        return d.x1 - d.x0;
      })
      .attr("height", function(d) {
        return d.y1 - d.y0;
      })
      .attr("fill", function(d, i) {
        var a = d.ancestors();
        return that.colorScale(a[a.length - 2].id);
      });

    let label = container.append("text")
      .attr("clip-path", d => "url(#clip-" + d.id + ")");

    label.append("tspan")
      .attr("x", 4)
      .attr("y", 18)
      .attr("font-family", 'Oswald')
      .style("font-size", "1rem")
      .style("font-weight", "bold")
      .text(function(d) {
        if (((d.x1 - d.x0) > 30) && ((d.y1 - d.y0) > 20)) {
          return d.id;
        }
      });

    label.append("tspan")
      .attr("x", 4)
      .attr("y", 36)
      .style("font-size", "1rem")
      .attr("font-family", 'Oswald')
      .text(function(d) {
        if (((d.x1 - d.x0) > 30) && ((d.y1 - d.y0) > 20)) {
          return that.format(d.value);
        }
      });

    container.append("title")  // for tooltip
      .text(function(d) {
        let parentName = d.data.parent;
        parentName = parentName.replace(/-/g, ' ');
        parentName = parentName.split(" ");

        let mus = '';
        for (let word of parentName) {
          mus = mus + " " + word.charAt(0).toUpperCase() + word.slice(1);
        }

        return mus + "\n" + "acquired " + that.format(d.value) +
          " artifacts\n" + "from " + d.data.fullCountryName +
          " between " + that.vizCoord.activeYearRange[0] + " to " +
          that.vizCoord.activeYearRange[1] + ".";
      });

  }

  filterData() {
    let data = [];

    //Add root
    data.push({
      number: null,
      country: "ROOT",
      parent: null,
    });

    for (let i = 0; i < this.museumNames.length; i++) {
      let selectedMuseumData = null;

      let museumName = this.museumNames[i];

      selectedMuseumData = this.museumData.filter(d => d.museum === museumName &&
        +d.acquisition_date >= this.vizCoord.activeYearRange[0] // acquisition year is between the range
        &&
        +d.acquisition_date <= this.vizCoord.activeYearRange[1]);

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
        fullCountryName: null,
        parent: "ROOT",
      });

      //create an object of the countries with the total number of artifacts
      for (let n of countries) {
        let filtData = selectedMuseumData.filter(d => d.country_code === n)
        data.push({
          number: filtData.map(y => y.artifact_name).length,
          country: n,
          fullCountryName: filtData.map(y => y.country_of_origin)[0],
          parent: museumName
        })
      }
    }

    return data;
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
