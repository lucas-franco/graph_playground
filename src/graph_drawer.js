import * as d3 from "d3";

var nodes = [];
var links = [];

var lastNodeId = nodes.length;
var viewWid = document.documentElement.clientWidth;
var w = viewWid > 1200 ? 900 : 700;
var h = w == 900 ? 600 : 500;
var rad = 12;

document.getElementById("properties").style.width = "" + w + "px";

var div = d3.select("#svg-wrap")
    .append("div")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "tooltip")
    .style("opacity", 0);

window.div = div;

var svg = d3.select("#svg-wrap")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


//array of colors for nodes
var colors = d3.schemeCategory10;

//the animation line when adding edge b/w two vertices
var dragLine = svg.append("path")
    .attr("class", "dragLine hidden")
    .attr("d", "M0,0L0,0");

var edges = svg.append("g")
    .selectAll(".edge");

var vertices = svg.append("g")
    .selectAll(".vertex");

var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-300).distanceMax(w / 2))
    .force("link", d3.forceLink().distance(60))
    .force("x", d3.forceX(w / 2))
    .force("y", d3.forceY(h / 2))
    .on("tick", tick);

var force = d3
    .forceSimulation()
    .force(
        "charge",
        d3
        .forceManyBody()
        .strength(-300)
        .distanceMax((w + h) / 2)
    )
    .force("link", d3.forceLink().distance(100))
    .force("x", d3.forceX(w / 2))
    .force("y", d3.forceY(h / 2))
    .on("tick", tick);
force.nodes(nodes);
force.force("link").links(links);

//update positions of edges and vertices with each internal timer's tick
function tick() {

    edges.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // vertices.attr("cx", function(d) { return d.x; })
    //     .attr("cy", function(d) { return d.y; });
    //here vertices are g.vertex elements
    vertices.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

}

//updates the graph by updating links, nodes and binding them with DOM
//interface is defined through several events
function restart() {
    edges = edges.data(links, function(d) {
        return "v" + d.source.id + "-v" + d.target.id;
    });
    edges.exit().remove();

    var ed = edges
        .enter()
        .append("line")
        .attr("class", "edge")
        .on("mousedown", function() {
            d3.event.stopPropagation();
        })
        .on("contextmenu", removeEdge);

    ed.append("title").text(function(d) {
        return "v" + d.source.id + "-v" + d.target.id;
    });

    edges = ed.merge(edges);

    //vertices are known by id
    vertices = vertices.data(nodes, function(d) {
        return d.id;
    });
    vertices.exit().remove();

    var g = vertices
        .enter()
        .append("g")
        .attr("class", "vertex")
        //so that force.drag and addNode don't interfere
        //mousedown is initiated on circle which is stopped at .vertex
        .on("mousedown", function() {
            d3.event.stopPropagation();
        });



    g.append("circle")
        .attr("r", rad)
        .style("fill", function(d, i) {
            return colors[d.id % 10];
        })
        .on("mousedown", beginDragLine)
        .on("mouseup", endDragLine)
        .on("mouseover", function(d) {
            // window.graph.showVertexInfo(d);
        })
        .on("mouseout", function(d) {
            // window.graph.hideVertexInfo();
        })
        .on("contextmenu", removeNode)
        .append("title")
        .text(function(d) {
            return "v" + d.id;
        });
    div.on("mouseout", function(d) {
        console.log("show MOUSEOUT", d)
            // window.graph.hideVertexInfo();
    })

    // g.append("text")
    //     .attr("x", -8)
    //     .attr("y", 5)
    //     .attr("class", "vertex-text")
    //     .on("mousedown", beginDragLine)
    //     .on("mouseup", endDragLine)
    //     .on("contextmenu", removeNode)
    //     .text(function(d) {
    //         return "v" + d.id;
    //     });

    g.selectAll(".vertex")

    vertices = g.merge(vertices);

    force.nodes(nodes);
    force.force("link").links(links);
    force.alpha(0.8).restart();

    window.graph.refresh(nodes, links);
}

// CORE STUFF TO DRAW GRAPH ENDS //

// FUNCTIONS TO MANIPULATE GRAPH //

//interface for manipulation
svg.on("mousedown", addNode)
    .on("mousemove", updateDragLine)
    .on("mouseup", hideDragLine)
    .on("contextmenu", function() { d3.event.preventDefault(); })
    .on("mouseleave", hideDragLine);

function addNode() {
    if (d3.event.button == 0) {
        var coords = d3.mouse(this);
        var newNode = { x: coords[0], y: coords[1], id: ++lastNodeId };
        nodes.push(newNode);
        window.graph.hideVertexInfo();
        restart();
    }
}

//d is data, i is index according to selection
function removeNode(d, i) {
    //to make ctrl-drag works for mac/osx users
    if (d3.event.ctrlKey) return;
    nodes.splice(nodes.indexOf(d), 1);
    var linksToRemove = links.filter(function(l) {
        return l.source === d || l.target === d;
    });
    linksToRemove.map(function(l) {
        links.splice(links.indexOf(l), 1);
    });
    d3.event.preventDefault();
    restart();
    lastNodeId = nodes.map((it) => it.id).reduce((a, b) => Math.max(a, b));
}

function removeEdge(d, i) {
    links.splice(links.indexOf(d), 1);
    d3.event.preventDefault();
    restart();
    // window.graph.removeEdge(links);
}

//dragLine is used to add edge graphicaly b/w two nodes

//the two nodes of edges are mousedownNode and mouseupNode
var mousedownNode = null;
var mouseupNode = null;

function resetMouseVar() {
    mousedownNode = null;
    mouseupNode = null;
}

function hideDragLine() {
    dragLine.classed("hidden", true);
    resetMouseVar();
    restart();
}

function beginDragLine(d) {
    if (window.ctrlKeyIsPressed) {
        console.log("control key is pressed")
        window.graph.showVertexInfo(d);
    } else {
        window.graph.hideVertexInfo();

    }
    //to prevent call of addNode through svg
    d3.event.stopPropagation();
    //to prevent dragging of svg in firefox
    d3.event.preventDefault();
    if (d3.event.ctrlKey || d3.event.button != 0) return;
    mousedownNode = d;
    dragLine.classed("hidden", false)
        .attr("d", "M" + mousedownNode.x + "," + mousedownNode.y +
            "L" + mousedownNode.x + "," + mousedownNode.y);
}

function updateDragLine() {
    if (!mousedownNode) return;
    dragLine.attr("d", "M" + mousedownNode.x + "," + mousedownNode.y +
        "L" + d3.mouse(this)[0] + "," + d3.mouse(this)[1]);
}

//no need to call hideDragLine in endDragLine
//mouseup on vertices propagates to svg which calls hideDragLine
function endDragLine(d) {
    if (!mousedownNode || mousedownNode === d) return;
    //return if link already exists
    for (var i = 0; i < links.length; i++) {
        var l = links[i];
        if ((l.source === mousedownNode && l.target === d) || (l.source === d && l.target === mousedownNode)) {
            return;
        }
    }
    var newLink = { source: mousedownNode, target: d };
    links.push(newLink);
}

//clearAll button
d3.select("#clear")
    .on('click', function() {
        nodes.splice(0);
        links.splice(0);
        lastNodeId = 0;
        restart();
    });

// FUNCTIONS TO MANIPULATE GRAPH ENDS //

// Functions to enable draging of nodes when ctrl is held

//one response per ctrl keydown
var lastKeyDown = -1;

d3.select(window)
    .on('keydown', keydown)
    .on('keyup', keyup);

function keydown() {
    d3.event.preventDefault();
    if (lastKeyDown !== -1) return;
    lastKeyDown = d3.event.key;

    if (lastKeyDown === "Control") {
        vertices.call(d3.drag()
            .on("start", function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(1).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", function(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            })
            .on("end", function(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }));
    }
}

function keyup() {
    lastKeyDown = -1;
    if (d3.event.key === "Control") {
        vertices.on("mousedown.drag", null);
    }
}

function mapVertexToNode(vertex) {
    return {
        id: vertex["id"]
    }
}

function mapEdgeToLink(edge) {
    return {
        source: edge["source"],
        target: edge["target"],
    }
}

function start() {
    window.graph.restartGraph = () => start();
    nodes = window.graph.graphVertices.map((it) => mapVertexToNode(it));
    links = window.graph.graphEdges.map((it) => mapEdgeToLink(it));
    lastNodeId = nodes.map((it) => it.id).reduce((a, b) => Math.max(a, b));;
    console.log("start", { nodes, links });
    restart();
}

// Start
start();