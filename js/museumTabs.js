class MuseumTabs {
  /**
   * Test comment
   */
  constructor(data) {
    this.data = data;
    console.log(data);

    this.tabNum = {tab: 0};
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
    let view = d3.selectAll('.column');
    // view.append("svg").attr('id', 'museumTabContainer');
    let tab = view.select("#museumTabContainer")
        .attr("transform", "translate(10, 10)") //-400
        .attr("width", 250)
        .attr("height", 200);

    let container = tab.selectAll("svg").data(this.data).enter()
      .append("svg") //.attr("id", "museumTextBoxContainer")
      .attr("id", function(d, i) {
        return "museumBox"+i;
      })
      .classed("activeTab", function(d, i) {
        if (i==0) {return true; }
        else return false;
      })
      .classed("unactiveTab", function(d, i) {
        if (i!=0) {return true; }
        else return false;
      })
      .classed("container", true)
      .attr("transform", function(d, i) {
          console.log(i);
          if (i==0) {
            return "translate(0, 0)";
          } else {
            return "translate(-400, 0)";
          }
      });

    container.append("g")
      .classed("museumTextBox", true)
      .attr("transform", function(d, i) {
          if (i==0) {
            return "translate(0, 0)";
          } else {
            return "translate(-400, 0)";
          }
      });

    tab.selectAll(".museumTextBox").append("text")
        .text(function(d) {
          return d.museumName;
        })
        .attr("font-size", "12")
        .attr("font-weight", "Bold")
        .attr("fill", "grey")
        .attr("font-family", "sans-serif")
        .attr("transform", "translate(50, 20)");

    tab.selectAll(".museumTextBox").append("text")
        .text(function(d) {
          return d.location;
        })
        .attr("font-size", "12")
        .attr("font-weight", "normal")
        .attr("fill", "grey")
        .attr("font-family", "sans-serif")
        .attr("transform", "translate(50, 40)");

    tab.selectAll(".museumTextBox").append("text")
        .text(function(d) {
          return d.website;
        })
        .attr("font-size", "8")
        .attr("font-weight", "normal")
        .attr("fill", "grey")
        .attr("font-family", "sans-serif")
        .attr("transform", "translate(50, 200)");

    let svg = tab.selectAll("svg");
    let fo = svg.append('foreignObject')
      .attr('x', 20)
      .attr('y', 20)
      .attr('width', 220)
      .attr("transform", function(d, i) {
          if (i==0) {
            return "translate(0, 20)";
          } else {
            return "translate(-400, 20)";
          }
      });

    fo.append('xhtml:div').html(function(d,i) {
        return "<p id='museumDescription'>"+d.about+"</p>";
    });

    //Add the circle nav. little things
    tab.selectAll("circle").data(this.data)
        .enter().append("circle")
        .classed("museumCircles", true);

    tab.selectAll(".museumCircles")
      .attr("r", 6)
      .attr("stroke", "grey")
      .attr("fill", "white")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("id", function(d,i) {
          return "museum"+i;
      })
      .attr("transform", function(d,i) {
          return "translate("+ that.xScale(i)+", 170)";
      });

    tab.select("#museum0").classed("selectedTab", true);

    //Add the nav. triagle buttons
    var trianglePoints = 3 + ' ' + 12 + ', ' + 1 + ' ' + 0 + ', ' + 12 + ' ' + 3 + ' ' + 12 + ', ' + 3 + ' ' + 3 + ' ' + 12;

    tab.append('polyline').attr("id", "museumTriangle")
        .attr('points', trianglePoints)
        .style('fill', 'grey')
        .attr("transform", "translate(15, 173) rotate(75) scale(1.2)")
        .attr("rx", 2)
        .attr("ry", 2)
        .on("click", function(d, i) {
            that.switchTab("left");
        });

    tab.append('polyline').attr("id", "museumTriangle")
        .attr('points', trianglePoints)
        .style('fill', 'grey')
          .attr("transform", "translate(220, 173) rotate(10) scale(1.2)")
        .on("click", function(d, i) {
            that.switchTab("right");
        });

  }

  switchTab(which) {
    let that = this;

    let tab = d3.selectAll('.column').select("#museumTabContainer");

    if (which == "left") {
      if (this.tabNum.tab > 0 ) {
        this.tabNum.tab--;
      }

      let active = tab.select(".activeTab.container");

      active.select(".museumTextBox")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
            return "translate(-400, 0)";
        });
      active.select("foreignObject")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
            return "translate(-400, 0)";
        });


    } else if (which == "right") {
      if ( this.tabNum.tab < this.numMuseums-1 ) {
        this.tabNum.tab++;
      }

      let active = tab.select(".activeTab.container")

      active.select(".museumTextBox")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
            return "translate(400, 0)";
        });
      active.select("foreignObject")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
            return "translate(400, 0)";
        });

    }

    tab.select(".activeTab.container")
        .classed("activeTab", false).classed("unactiveTab", true);

    let selected = tab.select("#museumBox"+this.tabNum.tab);

    selected.select(".museumTextBox")
        .transition().duration(that.animationDuration)
        .attr("transform", function(d, i) {
            return "translate(0, 0)";
        });

    selected.select("foreignObject")
      .transition().duration(that.animationDuration)
      .attr("transform", function(d, i) {
          return "translate(0, 20)";
      });

    selected.classed("unactiveTab", false)
        .classed("activeTab", true);

    //selected circles
    tab.select(".selectedTab").classed("selectedTab", false);
    tab.select("#museum"+this.tabNum.tab).classed("selectedTab", true);

  }
}
