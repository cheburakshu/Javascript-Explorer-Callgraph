function callGraph(graph){
  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  svg.selectAll("*").remove();  

  var color = d3.scaleOrdinal(d3.schemeCategory20);
  
  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(120).strength(1))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
 
    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
        .attr("stroke-width", 1)
      .style("marker-end",  "url(#suit)") //Added 
  	
    var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("g")
  	.attr("class","node")
      .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
//      .on('click', connectedNodes); //Added code   
        .on("mouseover", fade(.1)).on("mouseout", fade(1))

    node.append("circle")
        .attr("r", 5)
        .style("fill", function (d) {
        return color(d.group);
    })		  
  
    node.append("text")
        .attr("dx", 10)
        .attr("dy", ".35em")
        .text(function(d) { return d.id });  
    
    node.append("title")
        .text(function(d) { return d.code; }); 
  
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);
  
    simulation.force("link")
        .links(graph.links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
  
      
      d3.selectAll("circle").attr("cx", function (d) {
          return d.x;
      })
          .attr("cy", function (d) {
          return d.y;
      });
  
      d3.selectAll("text").attr("x", function (d) {
          return d.x;
      })
          .attr("y", function (d) {
          return d.y;
      });
  	
    }
  
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  //---Insert-------
  svg.append("defs").selectAll("marker")
      .data(["suit"])
    .enter().append("marker")
      .attr("id", function(d) { return d; })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
      .style("stroke", "#4679BD")
      .style("opacity", "0.6")
      .on("mouseover", fade(0.6)).on("mouseleave",fade(0.1))


  //Toggle stores whether the highlighting is on
  var toggle = 0;
  //Create an array logging what is connected to what
  var linkedByIndex = {};
  for (i = 0; i < graph.nodes.length; i++) {
      linkedByIndex[i + "," + i] = 1;
  };
  graph.links.forEach(function (d) {
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
  });

  function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
  }


  function fade(opacity) {
        return function(d) {
            node.style("stroke-opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });

            link.style("stroke-opacity", opacity).style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
            link.style("stroke", "#999").style("stroke", function(o) {
                return o.source === d || o.target === d ? "red" : "#999";
            });
        };
  }


}

