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
      .domain([0, 7])
      .range([150, 350])
      .nice();
  }

  drawMuseumTabs() {
    let that = this;

    //Create the tab thing?
    let view = d3.selectAll('.column');
    // view.append("svg").attr('id', 'museumTabContainer');
    let tab = view.select("#museumTabContainer")
      .attr("transform", "translate(0, -33)") //-400
      .attr("width", 500)
      .attr("height", 500);

    tab.append("rect")
      .attr("width", 500)
      .attr("height", 500)
      .attr("rx", 10)
      .attr("ry", 10)
      .style("fill", "white")
      .style("stroke", "#d9d9d9")
      .style("stroke-width", 6)

    let container = tab.selectAll("svg").data(this.data).enter()
      .append("svg") //.attr("id", "museumTextBoxContainer")
      .attr("id", function(d, i) {
        return "museumBox" + i;
      })
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
      .classed("container", true)
      .attr("transform", function(d, i) {
        if (i == 0) {
          return "translate(0, 0)";
        } else {
          return "translate(-600, 0)";
        }
      });

    container.append("g")
      .classed("museumTextBox", true)
      .attr("transform", function(d, i) {
        if (i == 0) {
          return "translate(0, 0)";
        } else {
          return "translate(-600, 0)";
        }
      });

    tab.selectAll(".museumTextBox").append("text")
      .text(function(d) {
        return d.museumName.toUpperCase();
      })
      .attr("font-size", "1.5rem")
      .attr("font-weight", "Bold")
      .attr("font-family", 'Oswald')
      .attr("transform", "translate(35, 60)");

    tab.selectAll(".museumTextBox").append("text")
      .text(function(d) {
        return d.location;
      })
      .attr("font-size", "1.0rem")
      .attr("font-weight", "normal")
      // .attr("font-family", "sans-serif")
      .attr("font-family", 'Montserrat')
      .attr("transform", "translate(35, 90)");

    tab.selectAll(".museumTextBox").append("text")
      .text(function(d) {
        return d.website;
      })
      .attr("font-size", "0.8rem")
      .attr("font-weight", "normal")
      .attr("fill", "grey")
      .attr("font-family", "sans-serif")
      .attr("transform", "translate(35, 115)");

    let svg = tab.selectAll("svg");
    let fo = svg.append('foreignObject')
      .attr('width', 400)
      .attr('height', 200)
      .attr("transform", function(d, i) {
        if (i == 0) {
          return "translate(35, 150)";
        } else {
          return "translate(-600, 150)";
        }
      });

    fo.append('xhtml:div').html(function(d, i) {
      return "<p id='museumDescription'>" + d.about + "</p>";
    });

    //Add the circle nav. little things
    tab.selectAll("circle").data(this.data)
      .enter().append("circle")
      .classed("museumCircles", true);

    tab.selectAll(".museumCircles")
      .attr("r", 7)
      .attr("stroke", "grey")
      .attr("fill", "white")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("id", function(d, i) {
        return "museum" + i;
      })
      .attr("transform", function(d, i) {
        return "translate(" + that.xScale(i) + ", 450)";
      });

    tab.select("#museum0").classed("selectedTab", true);

    //Add the nav. triagle buttons
    var trianglePoints = 3 + ' ' + 12 + ', ' + 1 + ' ' + 0 + ', ' + 12 + ' ' + 3 + ' ' + 12 + ', ' + 3 + ' ' + 3 + ' ' + 12;

    // tab.append('polyline').attr("id", "museumTriangle")
    //     .attr('points', trianglePoints)
    //     .style('fill', 'grey')
    //     .attr("transform", "translate(15, 173) rotate(75) scale(1.2)")
    //     .attr("rx", 2)
    //     .attr("ry", 2)
    //     .on("click", function(d, i) {
    //         that.switchTab("left");
    //     });
    //
    // tab.append('polyline').attr("id", "museumTriangle")
    //     .attr('points', trianglePoints)
    //     .style('fill', 'grey')
    //       .attr("transform", "translate(220, 173) rotate(10) scale(1.2)")
    //     .on("click", function(d, i) {
    //         that.switchTab("right");
    //     });

  }

  switchTab(which) {
    console.log(this.data);
    console.log(which);

    let tabnum = 0;
    for (let i = 0; i < this.data.length; i++) {
      let museumName = this.data[i].museumName.toLowerCase().replace(/ /g, '-');
      museumName = museumName.slice(0, -1);

      // console.log(museumName);
      if (which == museumName) {
        tabnum = i;
      }
    }

    console.log("tabNum " + tabnum);
    let that = this;
    let tab = d3.selectAll('.column').select("#museumTabContainer");
    let active = tab.select(".activeTab.container");

    let activeId = active.attr("id")[active.attr("id").length - 1];;
    console.log("activeId " + activeId);

    // if (which == "left") {
    if (tabnum < activeId) {
      console.log("left")
      if (this.tabNum.tab > 0) {
        this.tabNum.tab--;
      }

      active.select(".museumTextBox")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
          return "translate(-600, 0)";
        });
      active.select("foreignObject")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
          return "translate(-600, 150)";
        });


      // } else if (which == "right") {
    } else if (tabnum > activeId) {
      console.log("right")
      if (this.tabNum.tab < this.numMuseums - 1) {
        this.tabNum.tab++;
      }

      // let active = tab.select(".activeTab.container")

      active.select(".museumTextBox")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
          return "translate(600, 0)";
        });
      active.select("foreignObject")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
          return "translate(600, 150)";
        });

    }

    tab.select(".activeTab.container")
      .classed("activeTab", false).classed("unactiveTab", true);

    // let selected = tab.select("#museumBox"+this.tabNum.tab);
    let selected = tab.select("#museumBox" + tabnum);

    selected.select(".museumTextBox")
      .transition().duration(that.animationDuration)
      .attr("transform", function(d, i) {
        return "translate(0, 0)";
      });

    selected.select("foreignObject")
      .transition().duration(that.animationDuration)
      .attr("transform", function(d, i) {
        return "translate(35, 150)";
      });

    selected.classed("unactiveTab", false)
      .classed("activeTab", true);

    //selected circles
    tab.select(".selectedTab").classed("selectedTab", false);
    tab.select("#museum" + tabnum).classed("selectedTab", true);

  }
}