var d3 = require('d3')
var topojson = require('topojson')
var xmldom = require('xmldom');

var width = 5000,
    height = 10000;

var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var fs = require('fs')

function dom_string_lower(ds){
    var cd = {}, //var to backup cdata contents
        i = 0,//key integer to cdata token
        tk = String(new Date().getTime());//cdata to restore

    //backup cdata and attributes, after replace string by tokens
    ds = ds.replace(/\<!\[CDATA\[.*?\]\]\>|[=]["'].*?["']/g, function(a){
        var k = tk + "_" + (++i);
        cd[k] = a;
        return k;
    });

    //to lower xml/html tags
    ds = ds.replace(/\<([^>]|[^=])+([=]| |\>)/g, function(a, b){
        return String(a).toLowerCase();
    });

    //restore cdata contents
    for(var k in cd){
        ds = ds.replace(k, cd[k]);
    }

    cd = null;//Clean variable
    return ds;
}



fs.readFile("topology4326.json",function(e,data){
    var topology = JSON.parse(data)
    var grids = topology.objects.grids;
    var gridf = topojson.feature(topology, grids)

    var bbox =  topology.bbox
    var centerx = bbox[2] - bbox[0]
    var centery = bbox[3] - bbox[1]
    console.log([centerx,centery])
    var projection = d3.geo.mercator()
                     .center([centerx,centery])

    var projection = d3.geo.mercator()
                     .center([-121.3, 37.26])
                     //.rotate([4.4, 0])
                     .scale(200000)
                     .translate([width/2, height / 2]);

    var path = d3.geo.path()
               .projection(projection);
    svg.selectAll("path")
    .data(gridf.features)
    .enter().append("path")
    .attr("d", path);
    var svgGraph = d3.select('svg')
                   .attr('xmlns', 'http://www.w3.org/2000/svg');
    var svgXML = (new xmldom.XMLSerializer()).serializeToString(svgGraph[0][0]);


    fs.writeFile('graph.svg', dom_string_lower(svgXML));
})
