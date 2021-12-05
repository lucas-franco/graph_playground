// interface Vertex {
//     id: number;
//     degree: number;
//     edges: Edge[];
// }

// interface Edge {
//     source: number;
//     target: number;
// }
import _ from 'underscore';
import * as GraphProperties from "./graph_properties";
import * as FileService from "./file_service";
// import * as GraphDrawer from "./graph_drawer";

const INIT_VERTICES = [
    { id: 1, degree: 2 },
    { id: 2, degree: 3 },
    { id: 3, degree: 3 },
    { id: 4, degree: 2 },
    { id: 5, degree: 0 }
];

const INIT_EDGES = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 2, target: 3 }
];



const TestType = {
    MIN_MAX_DEGREE: "MIN_MAX_DEGREE",
    REGULAR: "REGULAR",
}

const PropertyType = {
    GROUPS: "GROUPS",
    MIN_DEGREE: "MIN_DEGREE",
    MAX_DEGREE: "MAX_DEGREE",
}

var ctrlKeyIsPressed = false;
document.addEventListener('keydown', function(event) {
    console.log("keydown", event);
    if (event.key == "Control") {
        window.ctrlKeyIsPressed = true;
    }
});

document.addEventListener('keyup', function(event) {
    console.log("keyup", event);
    if (event.key == "Control") {
        window.ctrlKeyIsPressed = false;
    }
});


class Graph {
    // graphVertices: Array<Vertex> = [];
    // graphEdges: Array<Edge> = [];
    graphVertices = INIT_VERTICES;
    graphEdges = INIT_EDGES;
    currentTest = TestType.MIN_MAX_DEGREE;
    propertiesToShow = [];
    restartGraph;

    // utils
    isEdgeOfVertex = (vertex, edge) => {
        return (
                vertex.id == edge.source ||
                vertex.id == edge.target) &&
            (
                vertex.edges == null ||
                !vertex.edges.includes(edge));
    }

    // mappers
    mapNodeToVertex = (node) => ({
        id: node['id'],
        degree: 0,
        edges: [],
    })
    mapLinkToEdge = (link) => ({
        source: link['source']["id"],
        target: link['target']["id"],
    })

    addEdge(link) {
        // console.log("addEdge", link);
        var newEdge = this.mapLinkToEdge(link);
        this.graphEdges = [
            ...this.graphEdges,
            newEdge,
        ];
        this.graphVertices = this.graphVertices.map(
            (it) => this.isEdgeOfVertex(it, newEdge) ? {...it, degree: it.degree + 1, edges: [...it.edges || [], newEdge] } :
            it);

        // console.log("addEdge end", { graphEdges: this.graphEdges, graphVertices: this.graphVertices });
    }


    // Main methods
    showVertexInfo(node) {
        if (window.div.style("opacity") > 0 && window.div.attr("id") == node.id) {
            return;
        }
        var vertex = this.graphVertices.find((vertex) => vertex["id"] == node["id"]);
        window.div.html(
                GraphProperties.getVertexId(vertex) +
                GraphProperties.getVertexDegree(vertex) +
                GraphProperties.getVertexNeighborhood(vertex)
            )
            .attr("id", function() {
                return vertex.id.toString();
            })
            .style("margin-left", (node.x + 20) + "px")
            .style("margin-top", (node.y - 12) + "px");

        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        window.div.transition()
            .duration(200)
            .style("z-index", 0)
            .style("opacity", .98);

    }
    hideVertexInfo() {
        window.div.transition()
            .duration(200)
            .style("z-index", -1)
            .style("opacity", 0);
    }

    showGraphInfo() {
        var contentsToShow = "";
        if (this.propertiesToShow.find((it) => it == PropertyType.GROUPS)) {
            contentsToShow += GraphProperties.showGroups(this.graphVertices, this.graphEdges);
        }
        if (this.propertiesToShow.find((it) => it == PropertyType.MIN_DEGREE)) {
            contentsToShow += GraphProperties.showGraphMinDegree();
        }
        if (this.propertiesToShow.find((it) => it == PropertyType.MAX_DEGREE)) {
            contentsToShow += GraphProperties.showGraphMaxDegree();
        }
        // console.log("showGraphInfo final", contentsToShow);
        document.getElementById("svg-output").textContent = contentsToShow;
        if (MathJax != null && MathJax.Hub != null) {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }

    }

    showGraphInfoThrottle = _.throttle(this.showGraphInfo, 500)

    refresh(nodes, links) {
        // console.log("refresh", { nodes, links });

        this.graphVertices = nodes.map((it) => this.mapNodeToVertex(it));
        this.graphEdges = [];
        links.map((it) => {
            this.addEdge(it);
        });
        this.showGraphInfoThrottle();
        // console.log("refresh end", { graphEdges: this.graphEdges, graphVertices: this.graphVertices });
    }

    importGraph(vertices, edges) {
        console.log("importGraph", vertices, edges);
        this.graphVertices = vertices;
        this.graphEdges = edges;
        this.restartGraph();
    }

}

window.graph = new Graph();


document.getElementById('property_min-degree')
    .addEventListener('change', function(event) {
        console.log("property_min-degree", event);
        if (event.target.checked) {
            window.graph.propertiesToShow.push(PropertyType.MIN_DEGREE);
        } else {
            var index = window.graph.propertiesToShow.indexOf((it) => it == PropertyType.MIN_DEGREE);
            window.graph.propertiesToShow.splice(index, 1);
        }
        window.graph.showGraphInfo();

    });

document.getElementById('property_max-degree')
    .addEventListener('change', function(event) {
        console.log("property_max-degree", event);

        if (event.target.checked) {
            window.graph.propertiesToShow.push(PropertyType.MAX_DEGREE);
        } else {
            var index = window.graph.propertiesToShow.indexOf((it) => it == PropertyType.MAX_DEGREE);
            window.graph.propertiesToShow.splice(index, 1);
        }
        window.graph.showGraphInfo();
    });

document.getElementById('property_groups')
    .addEventListener('change', function(event) {
        console.log("property_groups", event);
        if (event.target.checked) {
            window.graph.propertiesToShow.push(PropertyType.GROUPS);
        } else {
            var index = window.graph.propertiesToShow.indexOf((it) => it == PropertyType.GROUPS);
            console.log("index", { propertiesToShow: window.graph.propertiesToShow, index })
            window.graph.propertiesToShow.splice(index, 1);
        }
        window.graph.showGraphInfo();
    });

document.getElementById("export")
    .addEventListener('click', function() {
        FileService.exportGraphMl(window.graph.graphVertices, window.graph.graphEdges);
    });