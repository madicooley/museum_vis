class DataPortrait {
  constructor(data) {
    this.data = data
    let museumNames = []

    for (let museums of this.data) {
      museumNames.push(museums.museum)
    }
    //remove duplicates
    let museumsSet = new Set(museumNames)
    this.museums = [...museumsSet]

    this.museumData = []
    for (let n of this.museums) {
      let filtData = this.data.filter(d => d.museum === n)
      this.museumData.push({
        museum: n,
        years: filtData.map(y => y.created_date),
        countries: filtData.map(y => y.country_of_origin),
        artifacts: filtData.map(y => y.artifact_name).length
      })
    }

    this.artifacts = []
    for (let countries of this.museumData) {
      let countrySet = new Set(countries["countries"])
      countries["countries"] = [...countrySet]
      this.artifacts.push(countries.artifacts)
    }

    this.colors = ["#b5a5e3", "#b1af00", "#ff5b1a", "#e2a333", "#5b7769"]

    this.artifactScale = d3.scaleOrdinal()
      .domain([d3.min(this.artifacts), d3.max(this.artifacts)])
      .range([1, 5])


  }

  dataSummary(data) {
    let i = 0;
    for (let museum of this.museumData) {
      this.drawPortrait(museum, i)
      i++
    }

  }

  drawPortrait(museum, i) {
    let svg = d3.select("#portraits").attr("width", "100%").attr("height", 500)

    console.log("Drawing:", museum)
    svg = svg.append("g").attr("id", museum.museum).attr("width", "100%").attr("height", 500)


    let length = museum.years.length

    let bc = museum.years.filter(d => d === 0 || d < 0)
    let first = museum.years.filter(d => d >= 0 && d < 501)
    let second = museum.years.filter(d => d >= 501 && d < 1001)
    let third = museum.years.filter(d => d >= 1001 && d < 1501)
    let fourth = museum.years.filter(d => d >= 1501)


    let yearWidths = []
    yearWidths.push(bc.length / length)
    yearWidths.push(first.length / length)
    yearWidths.push(second.length / length)
    yearWidths.push(third.length / length)
    yearWidths.push(fourth.length / length)


    let frameWidth = 238
    let frameHeight = 360
    let rectWidth = [0]

    let portraitColors = svg
      .selectAll("rect")
      .data(yearWidths)
      .join("rect")
      .attr("height", frameHeight)
      .attr("width", (d, i) => {
        rectWidth.push((d * frameWidth) + rectWidth[i]);
        return d * frameWidth
      })
      .style("fill", (d, i) => this.colors[i])
      .attr("x", (d, i) => rectWidth[i])
      .attr("transform", "translate(7,5)")

    let frame = svg.append("rect")
      .classed("frame", true)
      .attr("width", frameWidth)
      .attr("border", 20)
      .attr("height", frameHeight)
      .style("stroke", "black")
      .style("stroke-width", 5)
      .style("fill", "none")
      .attr("transform", "translate(5,5)")

    let lineWidth = this.artifactScale(museum.artifacts)

    let artifactLine = svg
      .append("line")
      .attr("x1", frameWidth / 2)
      .attr("y1", frameHeight)
      .attr("x2", frameWidth)
      .attr("y2", frameHeight - (frameWidth / 2))
      .style("stroke", "black")
      .style("stroke-width", lineWidth)
      .attr("transform", "translate(5,5)")

    let countries = museum.countries.length
    countries = countries / 5;
    countries = Math.round(countries)
    let countryArray = []

    for (let i = 0; i < countries; i++) {
      countryArray.push(i)
    }

    let countryDots = svg
      .selectAll("circle")
      .data(countryArray)
      .join("circle")

    let j = 0;
    countryDots
      .attr("r", 5)
      .attr("cx", function(d, i) {
        if (i < 10) {
          if (i % 2 === 0) {
            return (i * 10) + 10
          } else {
            return (i * 10) + 20
          }
        } else {
          if (i % 2 === 0) {
            j = j + 1
            return (j * 10) + 10
          } else {
            j = j + 1
            return (j * 10) + 20
          }
        }
      })
      .attr("cy", function(d, i) {
        if (i < 10) {
          return (i * 10) + 10
        } else if (i >= 10 && i < 20) {
          return ((i - 10) * 10) + 10
        } else {
          return ((i - 20) * 10) + 10
        }
      })
      .attr("transform", "translate(20,20)")


    svg.attr("transform", `translate(${i*(frameWidth +50)},20)`).attr("margin", 20)
  }




}