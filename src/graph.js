import _ from 'underscore';
import * as GraphProperties from "./graph_properties";

const INIT_VERTICES = [
    { id: 0, },
    { id: 1, },
    { id: 2, },
    { id: 3, },
    { id: 4, },
    // { id: 6, },
    // { id: 7, },
    // { id: 8, },
    // { id: 9, },
    // { id: 10, },
    // { id: 11, },
    // { id: 12, },
    // { id: 13, },
];

const INIT_EDGES = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 0, target: 4 },
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 1, target: 4 },
    { source: 2, target: 3 },
    { source: 2, target: 4 },
    { source: 3, target: 4 },
];


export const TestType = {
    MIN_MAX_DEGREE: "MIN_MAX_DEGREE",
    REGULAR: "REGULAR",
}

export const PropertyType = {
    GROUPS: "GROUPS",
    TRIVIAL: "TRIVIAL",
    COMPLETE_GRAPH: "COMPLETE_GRAPH",
    MIN_DEGREE: "MIN_DEGREE",
    MAX_DEGREE: "MAX_DEGREE",
    REGULAR_GRAPH: "REGULAR_GRAPH",
    BIPARTITE: "BIPARTITE",
    CHROMATIC_COLOR: "CHROMATIC_COLOR",
    COLORING: "COLORING",
    CYCLES: "CYCLES",
    TREES: "TREES",
    COMPONENTS: "COMPONENTS",
}

export class Graph {
    graphVertices = INIT_VERTICES;
    graphEdges = INIT_EDGES;
    currentTest = TestType.MIN_MAX_DEGREE;
    propertiesToShow = [];
    restartGraph;
    chromaticNumber;

    // utils
    isEdgeOfVertex = (vertex, edge) => {
        // console.log("isEdgeOfVertex", { vertex, edge, includes: vertex.edges.includes(edge) })
        return (
                vertex.id == edge.source.id ||
                vertex.id == edge.target.id) &&
            (
                vertex.edges == null ||
                !vertex.edges.map(it => it.source).includes(edge) ||
                !vertex.edges.map(it => it.target).includes(edge)
            );
    }

    // mappers
    mapNodeToVertex = (node) => ({
        id: node['id'],
        degree: 0,
        edges: [],
    })
    mapLinkToEdge = (link) => ({
        source: link['source'],
        target: link['target'],
    })

    addEdge(link) {
        // console.log("addEdge", { link, graphVertices: this.graphVertices });
        var newEdge = this.mapLinkToEdge(link);
        this.graphEdges = [
            ...this.graphEdges,
            newEdge,
        ];

        this.graphVertices = this.graphVertices.map(
            (it) => this.isEdgeOfVertex(it, newEdge) ? {
                ...it,
                degree: it.degree + 1,
                edges: [...it.edges || [], newEdge],
            } : it);

        // console.log("addEdge end", { newEdge, graphEdges: this.graphEdges, graphVertices: this.graphVertices });
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

    hasProperty(property) {
        return this.propertiesToShow.find((it) => it == property);
    }

    showMathJaxOutput(content, componentId) {
        try {
            if (content.length > 0) {
                document.getElementById(componentId + "-card").classList.remove("output-card-display");
                document.getElementById(componentId).textContent = content;
                if (MathJax != null) {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                }
            } else {
                document.getElementById(componentId + "-card").classList.add("output-card-display");
                document.getElementById(componentId).textContent = content;
                if (MathJax != null) {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                }
            }
        } catch (e) {
            // 
        }
    }

    showGraphInfo() {
        var contentsToShow1 = "";
        if (this.hasProperty(PropertyType.GROUPS) || this.hasProperty(PropertyType.COMPLETE_GRAPH) || this.hasProperty(PropertyType.TRIVIAL)) {
            contentsToShow1 += GraphProperties.sectionHeader("Primeiros conceitos");
        }
        if (this.hasProperty(PropertyType.GROUPS)) {
            contentsToShow1 += GraphProperties.showGroups(this.graphVertices, this.graphEdges);
        }
        if (this.hasProperty(PropertyType.TRIVIAL)) {
            contentsToShow1 += GraphProperties.showTrivialGraph();
        }
        if (this.hasProperty(PropertyType.COMPLETE_GRAPH)) {
            contentsToShow1 += GraphProperties.showCompleteGraph();
        }

        this.showMathJaxOutput(contentsToShow1, "output-groups");

        var contentsToShow2 = "";
        if (this.hasProperty(PropertyType.MIN_DEGREE) || this.hasProperty(PropertyType.MAX_DEGREE) || this.hasProperty(PropertyType.REGULAR_GRAPH)) {
            contentsToShow2 += GraphProperties.sectionHeader("Grau");
        }
        if (this.hasProperty(PropertyType.MIN_DEGREE)) {
            contentsToShow2 += GraphProperties.showGraphMinDegree();
        }
        if (this.hasProperty(PropertyType.MAX_DEGREE)) {
            contentsToShow2 += GraphProperties.showGraphMaxDegree();
        }
        if (this.hasProperty(PropertyType.REGULAR_GRAPH)) {
            contentsToShow2 += GraphProperties.showGraphRegular();
        }
        this.showMathJaxOutput(contentsToShow2, "output-degree");




        var contentsToShow3 = "";
        if (this.hasProperty(PropertyType.BIPARTITE) || this.hasProperty(PropertyType.CHROMATIC_COLOR) || this.hasProperty(PropertyType.COLORING)) {
            contentsToShow3 += GraphProperties.sectionHeader("Coloração/multipartição");
        } else {
            GraphProperties.resetColoring(this.graphVertices);
        }

        if (this.hasProperty(PropertyType.BIPARTITE)) {
            GraphProperties.greedyColoring(this.graphVertices);
            contentsToShow3 += GraphProperties.showBiparte(window.graph.chromaticNumber == 2);
        }
        if (this.hasProperty(PropertyType.CHROMATIC_COLOR)) {
            GraphProperties.greedyColoring(this.graphVertices);
            contentsToShow3 += GraphProperties.showChromaticNumber(window.graph.chromaticNumber);
        }
        // if (this.hasProperty(PropertyType.COLORING)) {
        //     GraphProperties.greedyColoring(this.graphVertices);
        //     contentsToShow3 += GraphProperties.showBiparte(window.graph.chromaticNumber == 2);
        //     contentsToShow3 += GraphProperties.showChromaticNumber(window.graph.chromaticNumber);
        // } else {
        //     GraphProperties.resetColoring(this.graphVertices);
        // }
        this.showMathJaxOutput(contentsToShow3, "output-coloring");


        var contentsToShow4 = "";
        if (this.hasProperty(PropertyType.CYCLES)) {
            contentsToShow4 += GraphProperties.sectionHeader("Ciclos");
        }
        if (this.hasProperty(PropertyType.CYCLES)) {
            contentsToShow4 += GraphProperties.showCycles();
        }
        this.showMathJaxOutput(contentsToShow4, "output-cycles");

        var contentsToShow5 = "";
        if (this.hasProperty(PropertyType.TREES)) {
            contentsToShow5 += GraphProperties.sectionHeader("Árvores");
        }
        if (this.hasProperty(PropertyType.TREES)) {
            contentsToShow5 += GraphProperties.showTrees();
        }
        this.showMathJaxOutput(contentsToShow5, "output-trees");

        var contentsToShow6 = "";
        if (this.hasProperty(PropertyType.COMPONENTS)) {
            contentsToShow6 += GraphProperties.sectionHeader("Conectividade");
        }
        if (this.hasProperty(PropertyType.COMPONENTS)) {
            contentsToShow6 += GraphProperties.checkComponents();
        }
        this.showMathJaxOutput(contentsToShow6, "output-conectivity");


        // console.log("showGraphInfo final", contentsToShow);

        try {
            document.getElementById("svg-output").textContent = contentsToShow;
            if (MathJax != null) {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            }
        } catch (e) {
            // 
        }
    }

    showGraphInfoThrottle = _.throttle(this.showGraphInfo, 500)

    refresh(nodes, links) {
        var a = nodes.length != this.graphVertices.length;
        var b = links.length != this.graphEdges.length;
        var c = this.graphVertices.filter((e) => e.edges == null || e.edges.length == 0).length > 0;
        if (nodes.length != this.graphVertices.length || links.length != this.graphEdges.length || this.graphVertices.filter((e) => e.edges == null).length > 0) {
            this.graphVertices = nodes.map((it) => this.mapNodeToVertex(it));

            this.graphEdges = [];
            links.map((it) => {
                this.addEdge(it);
            });

            // if (nodes.length != this.graphVertices.length || links.length != this.graphEdges.length) {
            //     console.log("refresh/if", { nodes, links, graphEdges: this.graphEdges, graphVertices: this.graphVertices })
            //     this.graphVertices = vertices;
            //     this.graphEdges = edges;
            // }
            this.showGraphInfoThrottle();
        }


        // console.log("refresh end", { graphEdges: this.graphEdges, graphVertices: this.graphVertices });
    }

    importGraph(vertices, edges) {
        // console.log("importGraph", vertices, edges);
        this.graphVertices = vertices;
        this.graphEdges = edges;
        this.restartGraph();
    }

}