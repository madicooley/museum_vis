class DataPortrait {
  constructor() {

    this.year = [100, 120, 147, 162, 177, 192, 207, 222, 237, 267, 282, 297, 312, 327, 342, 357, 372, 387, 402, 417, 432, 447, 462, 477, , 507, 522, 537, 552, 567, 582, 597, 612, 627, 642, 657, 672, 687, 702, 717, 732, 747, 762, 777, 792, 807, 822, 837, 852, 867, , 897, 912, 927, 942, 957, 972, 987, 1002, 1017, 1032, 1047, 1062, 1077, 1092, 1107, 1122, 1137, 1152, 1167, 1182, 1197, 1212, 1227, 1242, 1257, 1272, 1287, 1302, 1317, 1332, 1347, 1362, 1377, 1392, 1407, 1422, 1437, 1452, 1467, 1482, 1497, 1512, 1527, 1542, 1557, 1572, 1587, 1602, 1617, 1632, 1647, 1662, 1677, 1692, 1707, 1722, 1737, 1752, 1767, 1782, 1797, 1812, 1827, 1842, 1857, 1872, 1887, 1902, 1917, 1932, 1947, 1962, 1977, 1992]

    this.bc = this.year.filter(d => d < 0)
    this.first = this.year.filter(d => d >= 0 && d < 501)
    this.second = this.year.filter(d => d >= 501 && d < 1001)
    this.third = this.year.filter(d => d >= 1001 && d < 1501)
    this.fourth = this.year.filter(d => d >= 1501 && d < 2001)


    this.countries = [
      "Mauritania ", "Belize ", "Montserrat ", "Holy See ", "Palau ", "South Africa ", "Togo ", "Virgin Islands(British)", "Estonia ", "Iceland ", "Turks and Caicos Islands ", "Wales ", "Republic of Ireland ", "Croatia ", "Saint Barthelemy ", "Saudi Arabia ", "Tanzania ", "Solomon Islands ", "England ", "Benin ", "Burundi ", "Malaysia ", "Lebanon ", "Cameroon ", "Mayotte ", "Andorra ", "Czech Republic ", "Mongolia ", "Cook Islands ", "New Caledonia ", "Fiji ", "Aruba ", "Indonesia ", "Namibia", "Botswana ", "Grenada ", "New Zealand ", "Italy ", "Hong Kong ", "Guernsey ", "Rwanda ", "Japan ", "Vietnam ", "Maldives ", "Cuba ", "Kiribati ", "Republic of the Congo ", "Papua New Guinea ", "Brazil ", "Turkey ", "Qatar ", "Faroe Islands ", "Suriname ", "Brunei ", "Azerbaijan ", "Bahrain ", "North Korea ", "Nigeria ", "Mozambique ", "Kenya ", "Norfolk Island ", "United Kingdom ", "Djibouti ", "Dominica ", "Gabon ", "Anguilla ", "Burkina Faso ", "Somalia ", "United Arab Emirates ", "Saint Lucia ", "Saint Kitts and Nevis ", "Guadeloupe ", "Kuwait ", "Uruguay ", "Russia ", "Austria ", "Sweden ", "Taiwan ", "Poland ", "Svalbard and Jan Mayen ", "United States Minor Outlying Island ", "Laos ", "Venezuela ", "Belarus ", "Scotland ", "Guatemala ", "American Samoa ", "Norway ", "South Sudan ", "Afghanistan ", "Ukraine ", "Liechtenstein ", "Thailand ", "Bermuda ", "Senegal ", "Bulgaria ", "Eritrea ", "Ivory Coast ", "Lithuania ", "South Georgia "
    ]

    this.artifacts = 100

    this.colors = ["#b5a5e3", "#b1af00", "#ff5b1a", "#e2a333", "#5b7769"]

  }

  dataSummary(data) {
    let canada = data
    console.log("this is Canada!", canada)

    this.drawPortrait()
  }

  drawPortrait() {
    let svg = d3.select("#portraits")

    svg.attr("width", "100%").attr("height", 500)

    let yearWidths = []
    let length = this.year.length
    yearWidths.push(this.bc.length / length)
    yearWidths.push(this.first.length / length)
    yearWidths.push(this.second.length / length)
    yearWidths.push(this.third.length / length)
    yearWidths.push(this.fourth.length / length)

    console.log(yearWidths)

    let frameWidth = 238

    let portrait = svg
      .selectAll("rect")
      .data(yearWidths)
      .join("rect")
      .attr("height", 360)
      .attr("width", d => d * frameWidth)
      .style("fill", (d, i) => this.colors[i])
      .attr("x", (d, i) => {
        let current = d * frameWidth
        for ()
      })

    let frame = svg.append("rect")
      .classed("frame", true)
      .attr("width", frameWidth)
      .attr("border", 20)
      .attr("height", 360)
      .style("stroke", "black")
      .style("stroke-width", 5)
      .style("fill", "none")
      .attr("transform", "translate(5,5)")

  }




}