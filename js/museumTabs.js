class MuseumTabs {
  /**
   * Test comment
   */
  constructor(data) {
    this.data = data;
    console.log(data);

    this.tabNum = {
      tab: 0
    };
    this.numMuseums = this.data.length;
    this.animationDuration = 500;

    this.xScale = d3.scaleLinear()
      .domain([0, 10])
      .range([25, 300])
      .nice();
  }

  drawMuseumTabs() {
    let that = this;

    //Create the tab thing?
    // let view = d3.selectAll('.column');
    // view.append("svg").attr('id', 'museumTabContainer');
    let tab = d3.select("#museumTabContainer")
      .attr("transform", "translate(-100, -100)") //-400
      .attr("width", 300)
      .attr("height", 200)
      .attr("border", 10)

    tab.append("rect")
      .attr("width", 300)
      .attr("height", 200)
      .attr("border", 10)
      .attr("rx", 10)
      .attr("ry", 10)
      .style("fill", "#c3c3c3")

    tab.selectAll("g").data(that.data)
      .enter()
      .append("g")
      .classed("museumTextBox", true)
      .classed("activeTab", function(d, i) {
        if (i == 0) {
          return true;
        } else return false;
      })
      .classed("unactiveTab", function(d, i) {
        if (i != 0) {
          return true;
        } else return false;
      })
      .attr("id", function(d, i) {
        return "museumBox" + i;
      })
      .attr("transform", function(d, i) {
        if (i == 0) {
          return "translate(0, 0)";
        } else {
          return "translate(-400, 0)";
        }
      });

    tab.selectAll(".museumTextBox").append("text")
      .text(function(d) {
        return d.museumName.toUpperCase();
      })
      .attr("font-size", "1.2rem")
      .attr("font-weight", "Bold")
      // .attr("fill", "grey")
      .attr("font-family", 'Oswald') //"sans-serif")
      .attr("transform", "translate(50, 40)");

    tab.selectAll(".museumTextBox").append("text")
      .text(function(d) {
        return d.location;
      })
      .attr("font-size", ".8rem")
      // .attr("font-weight", "normal")
      // .attr("fill", "grey")
      .attr("font-family", 'Montserrat')
      .attr("transform", "translate(50, 60)");

    // tab.selectAll(".museumTextBox").append("text")
    //     .text(function(d) {
    //       console.log(d.about);
    //       return d.about;
    //     })
    //     .attr("font-size", "12")
    //     .attr("font-weight", "normal")
    //     .attr("fill", "grey")
    //     .attr("font-family", "sans-serif")
    //     .attr("transform", "translate(50, 50)");

    // let x = d3.scaleOrdinal().rangeRoundBands([0, 200], .1, .3);

    // tab.selectAll(".museumDescript")
    // tab.call(wrap, function(d) { console.log(d.about); return d.about });

    //Add the circle nav. little things
    tab.selectAll("circle").data(that.data)
      .enter().append("circle")
      .classed("museumCircles", true);

    tab.selectAll(".museumCircles")
      .attr("r", 6)
      .attr("stroke", "grey")
      .attr("fill", "white")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("id", function(d, i) {
        return "museum" + i;
      })
      .attr("transform", function(d, i) {
        return "translate(" + that.xScale(i) + ", 170)";
      });

    tab.select("#museum0").classed("selectedTab", true);

    //Add the nav. triagle buttons
    var trianglePoints = 3 + ' ' + 12 + ', ' + 1 + ' ' + 0 + ', ' + 12 + ' ' + 3 + ' ' + 12 + ', ' + 3 + ' ' + 3 + ' ' + 12;

    console.log(trianglePoints);

    tab.append('polyline').attr("id", "museumTriangle")
      .attr('points', trianglePoints)
      .style('fill', 'grey')
      .attr("transform", "translate(15, 173) rotate(75) scale(1.2)")
      .attr("rx", 2)
      .attr("ry", 2)
      .on("click", function(d, i) {
        console.log("clicked 1");
        that.switchTab("left");
      });

    tab.append('polyline').attr("id", "museumTriangle")
      .attr('points', trianglePoints)
      .style('fill', 'grey')
      .attr("transform", "translate(220, 173) rotate(10) scale(1.2)")
      .on("click", function(d, i) {
        console.log("clicked 2");
        that.switchTab("right");
      });

    function wrap(text) {
      console.log("WRAPPING ", text);

      let width = 100;

      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

  }

  switchTab(which) {
    let that = this;

    let tab = d3.selectAll('.column').select("#museumTabContainer");

    if (which == "left") {
      if (that.tabNum.tab > 0) {
        that.tabNum.tab--;
      }

      tab.select(".museumTextBox.activeTab")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
          return "translate(-400, 0)";
        });


    } else if (which == "right") {
      if (that.tabNum.tab < that.numMuseums - 1) {
        that.tabNum.tab++;
      }

      tab.select(".museumTextBox.activeTab")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
          return "translate(400, 0)";
        });

    }

    tab.select(".museumTextBox.activeTab")
      .classed("activeTab", false).classed("unactiveTab", true);

    tab.select("#museumBox" + that.tabNum.tab)
      .transition().duration(that.animationDuration)
      .attr("transform", function(d, i) {
        return "translate(0, 0)";
      });

    tab.select("#museumBox" + that.tabNum.tab)
      .classed("unactiveTab", false)
      .classed("activeTab", true);

    tab.select(".selectedTab").classed("selectedTab", false);
    tab.select("#museum" + that.tabNum.tab).classed("selectedTab", true);

  }
}