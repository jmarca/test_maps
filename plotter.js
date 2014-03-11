var d3 = require('d3')
var topojson = require('topojson')
var xmldom = require('xmldom');

var width = 960,
    height = 500;

var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var fs = require('fs')
fs.readFile("smaller.topology.json",function(e,data){
    var topology = JSON.parse(data)
    var grids = topology.objects.grids;
    var gridf = topojson.feature(topology, grids)

    var projection = d3.geo.mercator().scale(300)

    var path = d3.geo.path()
               .projection(projection);
    svg.selectAll("path")
    .data(gridf.features)
    .enter().append("path")
    .attr("d", path);
    var svgGraph = d3.select('svg')
                   .attr('xmlns', 'http://www.w3.org/2000/svg');
    var svgXML = (new xmldom.XMLSerializer()).serializeToString(svgGraph[0][0]);
    fs.writeFile('graph.svg', svgXML);
})
