class DataPortrait {
  constructor(data, map) {
    this.map = map;
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
    let svg = d3.select("#portraits").attr("width", 500).attr("height", 600)
    // console.log("Drawing:", museum)
    svg = svg.append("g")


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


    let frameWidth = 238 * .3
    let frameHeight = 360 * .3
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
    countries = countries / 6;
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
    let k = 3
    countryDots
      .attr("r", 5)
      .attr("cx", function(d, i) {
        if (i < 10) {
          if (i % 2 === 0) {
            return (i * 10) + 10
          } else {
            return (i * 10) + 20
          }
        } else if (i >= 10 && i < 20) {
          if (i % 2 === 0) {
            j = j + 1
            return (j * 10) + 10
          } else {
            j = j + 1
            return (j * 10) + 20
          }
        } else {
          if (i % 2 === 0) {
            k = k + 1
            return (k * 10) + 10
          } else {
            k = k + 1
            return (k * 10)
          }
        }
      })
      .attr("cy", function(d, i) {
        if (i < 10) {
          return (i * 10) + 10
        } else if (i >= 10 && i < 20) {
          return ((i - 10) * 10) + 10
        } else {
          return ((i - 20) * 10 - 10)
        }
      })
      .attr("transform", "translate(7,20) scale(.5)")

    let ticker = i
    svg
      .attr("transform", function() {
        if (ticker < 4) {
          if (ticker === 0) {
            return `translate(0,${frameHeight*.2})`
          } else {
            return `translate(0,${ticker*1.2*frameHeight+(frameHeight*.2)})`
          }
        } else {
          ticker = ticker - 4
          if (ticker === 0) {
            return `translate(${frameWidth*1.2},${frameHeight*.2})`
          } else {
            return `translate(${frameWidth*1.2},${ticker*1.2*frameHeight+(frameHeight*.2)})`
          }
        }
      })
      .attr("margin", 20)



    let frame = svg
      .append("a")
      .attr("xlink:href", "#0")

    frame.append("rect")
      .attr("width", frameWidth)
      .attr("border", 20)
      .attr("height", frameHeight)
      .style("stroke", "black")
      .style("stroke-width", 5)
      // .style("fill", "none")
      .style("fill", "rgba(35, 29, 150, 0)")
      .attr("transform", "translate(5,5)")
      .attr("id", museum.museum)
      .attr("class", "porButton")
      .attr("data-tabindex", 0)


    frame.on("click", d => this.map.drawMuseum(museum.museum))
      .on("mouseover", function(d) {
        let title = museum.museum
        title === "metropolitan-museum-of-art" ? title = "The MET" : title === "minneapolis-institute-of-art" ? title = "Mia" : title === "cooper-hewitt-smithsonian-design-museum" ? title = "Cooper Hewitt" : title === "penn-museum" ? title = "Penn Museum" : title === "cleveland-museum-of-art" ? title = "Cleveland Museum of Art" : title === "museum-of-modern-art" ? title = "MoMa" : title = "Canada Science and Technology Museum"
        d3.select(this).append('svg:title')
          .text(title)
      });
  } //end drawPortraits
} //end Portraits class