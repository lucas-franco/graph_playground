import { GraphMLParser } from 'graphml-js';
import convert from 'xml-js';

const inputElement = document.getElementById("inputElement");

inputElement.onchange = importGraphMl;

export function importGraphMl(_) {
    const file = inputElement.files[0];
    readGraphMl(file);
}

function readGraphMl(file) {
    if (!file) return
    console.log("importGraphMl", file);
    const reader = new FileReader()
    reader.onload = (e) => {
        const textContent = e.target.result
        console.log("onLoad", { e, textContent });
        var parser = new GraphMLParser();
        parser.parse(textContent, function(err, graphml) {
            var graphVertices = mapGraphMlToVertices(graphml);
            var graphEdges = mapGraphMlToEdges(graphml, graphVertices);
            window.graph.importGraph(graphVertices, graphEdges);
        });
    }
    reader.onerror = (e) => {
        const error = e.target.error
        console.error(`Error occured while reading ${file.name}`, error)
    }

    reader.readAsText(file)
}

function mapGraphMlToVertices(graphml) {
    var nodes = graphml.nodes;
    var graphVertices = []
    nodes.forEach((node, index) => {
        var newVertice = {
            id: index,
            title: node["_id"]
        }
        graphVertices.push(newVertice);
    });
    return graphVertices;
}

function mapGraphMlToEdges(graphml, graphVertices) {
    var edges = graphml.edges;
    var graphEdges = []
    edges.forEach((edge) => {
        var newEdge = {
            source: graphVertices.findIndex(v => v.title == edge["_source"]),
            target: graphVertices.findIndex(v => v.title == edge["_target"]),
        }
        graphEdges.push(newEdge);
    });
    return graphEdges;
}

function verticesToGraphMl(vertices) {
    return vertices.map((v) => ({
        "_attributes": {
            id: v["id"]
        }
    }));
}

function edgesToGraphMl(edges) {
    return edges.map((e) => ({
        "_attributes": {
            source: e["source"]["id"],
            target: e["target"]["id"]
        }
    }));
}

export function exportGraphMl(vertices, edges) {
    var json = {
        "_declaration": {
            "_attributes": {
                "version": "1.0",
                "encoding": "UTF-8"
            }
        },
        "graphml": {
            "graph": {
                "node": verticesToGraphMl(vertices),
                "edge": edgesToGraphMl(edges),
            }
        }
    };
    var options = { compact: true, ignoreComment: true, spaces: 4 };
    var resultJson = convert.js2xml(json, options);
    download(resultJson, "graph.graphml", "text/plain");
}

function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}