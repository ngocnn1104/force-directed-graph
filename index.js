const graphDimension = 900;

const toolTip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


fetch("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json")
  .then(function(res) {
    const resjson = res.json();
    return resjson;
  })
  .then(function(resjson) {
    const response = resjson;
    const nodes = response.nodes;
    const links = response.links;

    const svg = d3.select("#graph").append("svg")
      .attr("width", graphDimension)
      .attr("height", graphDimension);

    const force = d3.layout.force()
      .size([graphDimension, graphDimension])
      .nodes(nodes)
      .links(links)
      .charge(-200)
      .gravity(0.2)
      .linkDistance(100)
      .start();

    const link = svg.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link");

    const flagsContainer = d3.select(".flags");

    const node = flagsContainer.selectAll("img")
      .data(nodes)
      .enter().append("img")
      .attr("width", 24)
      .attr("height", 24)
      .attr("class", function(d) {
        return ("flag flag-" + d.code);
      })
      .call(force.drag)
      .on("mouseover", function(d) {
        toolTip.transition()
          .duration(0)
          .style("opacity", 1);
        toolTip .html(d.country)
                .style("left", (d3.event.pageX+12)+"px")
                .style("top", (d3.event.pageY-30)+"px");
      })
      .on("mouseout", function(d) {
        toolTip.transition()
          .duration(0)
          .style("opacity", 0);
      });

    force.on("tick", function() {

      node.style("left", function(d) {return ((d.x-12) + "px");})
          .style("top", function(d) {return ((d.y-12) + "px");});

      link.attr("x1", function(d) { return d.source.x })
          .attr("y1", function(d) { return d.source.y })
          .attr("x2", function(d) { return d.target.x })
          .attr("y2", function(d) { return d.target.y });

    });
  })
