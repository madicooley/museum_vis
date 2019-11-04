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

    for (let countries of this.museumData) {
      let countrySet = new Set(countries["countries"])
      countries["countries"] = [...countrySet]
    }

    console.log(this.museumData)


    //
    //
    // this.countries = [
    //   "Mauritania ", "Belize ", "Montserrat ", "Holy See ", "Palau ", "South Africa ", "Togo ", "Virgin Islands(British)", "Estonia ", "Iceland ", "Turks and Caicos Islands ", "Wales ", "Republic of Ireland ", "Croatia ", "Saint Barthelemy ", "Saudi Arabia ", "Tanzania ", "Solomon Islands ", "England ", "Benin ", "Burundi ", "Malaysia ", "Lebanon ", "Cameroon ", "Mayotte ", "Andorra ", "Czech Republic ", "Mongolia ", "Cook Islands ", "New Caledonia ", "Fiji ", "Aruba ", "Indonesia ", "Namibia", "Botswana ", "Grenada ", "New Zealand ", "Italy ", "Hong Kong ", "Guernsey ", "Rwanda ", "Japan ", "Vietnam ", "Maldives ", "Cuba ", "Kiribati ", "Republic of the Congo ", "Papua New Guinea ", "Brazil ", "Turkey ", "Qatar ", "Faroe Islands ", "Suriname ", "Brunei ", "Azerbaijan ", "Bahrain ", "North Korea ", "Nigeria ", "Mozambique ", "Kenya ", "Norfolk Island ", "United Kingdom ", "Djibouti ", "Dominica ", "Gabon ", "Anguilla ", "Burkina Faso ", "Somalia ", "United Arab Emirates ", "Saint Lucia ", "Saint Kitts and Nevis ", "Guadeloupe ", "Kuwait ", "Uruguay ", "Russia ", "Austria ", "Sweden ", "Taiwan ", "Poland ", "Svalbard and Jan Mayen ", "United States Minor Outlying Island ", "Laos ", "Venezuela ", "Belarus ", "Scotland ", "Guatemala ", "American Samoa ", "Norway ", "South Sudan ", "Afghanistan ", "Ukraine ", "Liechtenstein ", "Thailand ", "Bermuda ", "Senegal ", "Bulgaria ", "Eritrea ", "Ivory Coast ", "Lithuania ", "South Georgia "
    // ]
    //
    // this.artifacts = 100

    this.colors = ["#b5a5e3", "#b1af00", "#ff5b1a", "#e2a333", "#5b7769"]

  }

  dataSummary(data) {
    console.log("this is Museums!", data[0])

    for (let museum of this.museumData) {
      this.drawPortrait(museum)
    }

  }

  drawPortrait(museum) {
    let svg = d3.select("#portraits")
    console.log("Drawing:", museum)
    svg.attr("width", "100%").attr("height", 500)


    let length = museum.countries.length

    let bc = museum.years.filter(d => {
      console.log("d:", d)
      return d === 0 || d < 0
    })
    let first = museum.years.filter(d => d >= 0 && d < 501)
    let second = museum.years.filter(d => d >= 501 && d < 1001)
    let third = museum.years.filter(d => d >= 1001 && d < 1501)
    let fourth = museum.years.filter(d => d.years >= 1501)
    console.log("BC", bc, first, second, third, fourth)

    let yearWidths = []
    // yearWidths.push(this.bc.length / length) yearWidths.push(this.first.length / length) yearWidths.push(this.second.length / length) yearWidths.push(this.third.length / length) yearWidths.push(this.fourth.length / length)


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

    let artifactLine = svg.append("line")
      .attr("x1", frameWidth / 2)
      .attr("y1", frameHeight)
      .attr("x2", frameWidth)
      .attr("y2", frameHeight - (frameWidth / 2))
      .style("stroke", "black")
      .style("stroke-width", 5)
      .attr("transform", "translate(5,5)")

    let countries = this.countries.length
    countries = countries / 5;
    countries = Math.round(countries)
    console.log(countries)
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
        if (i < 6) {
          if (i % 2 === 0) {
            return (i * 10) + 10
          } else {
            return (i * 10) + 15
          }
        } else {
          if (i % 2 === 0) {
            j = j + 1
            return (j * 10) + 10
          } else {
            j = j + 1
            return (j * 10) + 15
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


  }




}