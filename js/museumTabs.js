class MuseumTabs {
  /**
   *
   */
  constructor(data) {
    this.data = data;
    this.tabNum = {
      tab: 0
    };
    this.numMuseums = this.data.length;
    this.animationDuration = 500;

    this.xScale = d3.scaleLinear()
      .domain([0, 7])
      .range([150, 350])
      .nice();

    this.museumButton = null;
  }

  drawMuseumTabs() {
    let that = this;

    let view = d3.selectAll('.column');
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
      .append("svg")
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
      }).classed("museumName", true)
      .attr("transform", "translate(35, 60)");

    tab.selectAll(".museumTextBox").append("text")
      .text(function(d) {
        return d.location;
      }).classed("museumLocation", true)
      .attr("transform", "translate(35, 90)");

    tab.selectAll(".museumTextBox").append("text")
      .text(function(d) {
        return d.website;
      }).classed("museumWebsite", true)
      .attr("transform", "translate(35, 115)");

    let svg = tab.selectAll("svg");
    let fo = svg.append('foreignObject')
      .attr('width', 400)
      .attr('height', 300)
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
    // tab.selectAll("circle").data(this.data)
    //   .enter().append("circle")
    //   .classed("museumCircles", true);
    //
    // tab.selectAll(".museumCircles")
    //   .attr("r", 7)
    //   .attr("stroke", "grey")
    //   .attr("fill", "white")
    //   .attr("cx", 10)
    //   .attr("cy", 10)
    //   .attr("id", function(d, i) {
    //     return "museum" + i;
    //   })
    //   .attr("transform", function(d, i) {
    //     return "translate(" + that.xScale(i) + ", 450)";
    //   });
    //
    // tab.select("#museum0").classed("selectedTab", true);


    //on button clicks change the content
    d3.select("button#moma").on("click", function(d) {
      that.momaTabs("moma")
    })
    d3.select("button#penn").on("click", function(d) {
      that.momaTabs("penn")
    })
    let explore = d3.select("button#explore")

    // pennStory.on("click", that.storyTabs("penn"))
    // explore.on("click", that.storyTabs("explore"))

    //KEEP - Add the nav. triagle buttons
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
    let that = this;
    let tabnum = 0;

    for (let i = 0; i < this.data.length; i++) {
      let museumName = this.data[i].museumName.toLowerCase().replace(/ /g, '-');
      museumName = museumName.slice(0, -1);
      if (which == museumName) {
        tabnum = i;
      }
    }

    let tab = d3.selectAll('.column').select("#museumTabContainer");
    let active = tab.select(".activeTab.container");

    let activeId = active.attr("id")[active.attr("id").length - 1];;

    if (tabnum < activeId) {
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
    } else if (tabnum > activeId) {
      if (this.tabNum.tab < this.numMuseums - 1) {
        this.tabNum.tab++;
      }

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

  momaTabs(museum) {
    this.museumButton = museum
    let data = {
      moma: [
        "On April 15, 1958, MoMA caught on fire! The museum has been undergoing an update to its AC units, and while the workmen were taking a lunch break, a spark from a cigarette landed on some nearby sawdust which burst into flames, followed by highly flammable paint. Lost in the fire was one workman's life and an 18.5 foot Monet painting.", "Following the fire, the number of acquired artifacts drop from XXX to XXX and continue well into the 80s."
      ],
      penn: ["In 1929 Penn Museum received a generous donation from Eldridge Johnson, founder of the victor Talking Machine Company (a record company and phonograph manufacturer).", "You can see the effect of 💰 starting in 1929. The museum begins to acquire a lot more artwork following the funding."]
    }

    this.updateText(data[museum][0])

    let storyButton = d3.select("#museumBox0").select("#museumDescription")
      .append("div")
      .append("button")
      .classed("story-button bouncy", true)
      .text("Next")


    let that = this

    storyButton.on("click", function() {
      that.updateText(data[museum][1])
    })
  }

  updateText(text) {
    let museum = this.museumButton
    let museumInfo = {
      moma: ["🔥 at MoMA", "New York, NY | USA", "https://www.moma.org"],
      penn: ["💰💰💰", "Philadelphia, PA | USA", "https://www.penn.museum"]
    }
    d3.select("text.museumName").text(museumInfo[museum][0])
    d3.select("text.museumLocation").text(museumInfo[museum][1])
    d3.select("text.museumWebsite").text(museumInfo[museum][2])
    d3.select("#museumDescription").text(text)
  }

}