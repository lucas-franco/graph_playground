import _ from 'underscore';
import * as FileService from "./file_service";
import { Graph, PropertyType } from "./graph";
import * as GraphProperties from "./graph_properties";


window.graph = new Graph();

window.ctrlKeyIsPressed = false;
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

function togleProperty(event, propertyType) {
    if (event.target.checked) {
        window.graph.propertiesToShow.push(propertyType);
    } else {
        // var index = window.graph.propertiesToShow.indexOf((it) => it == propertyType);
        window.graph.propertiesToShow = window.graph.propertiesToShow.filter((e) => e != propertyType);
        console.log("togleProperty", window.graph.propertiesToShow);
    }
    window.graph.showGraphInfo();
}


document.getElementById('property_groups')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.GROUPS);
    });
document.getElementById('property_trivial')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.TRIVIAL);
    });
document.getElementById('property_complete-graph')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.COMPLETE_GRAPH);
    });

document.getElementById('property_min-degree')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.MIN_DEGREE);
    });

document.getElementById('property_max-degree')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.MAX_DEGREE);
    });

document.getElementById('property_regular-graph')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.REGULAR_GRAPH);
    });
document.getElementById('property_chromatic-color')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.CHROMATIC_COLOR);
    });
document.getElementById('property_bipartite')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.BIPARTITE);
    });

// document.getElementById('property_coloring')
//     .addEventListener('change', function(event) {
//         togleProperty(event, PropertyType.COLORING);
//     });

document.getElementById('property_cycles')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.CYCLES);
    });

document.getElementById('property_trees')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.TREES);
    });

document.getElementById('property_components')
    .addEventListener('change', function(event) {
        togleProperty(event, PropertyType.COMPONENTS);
    });

document.getElementById("export")
    .addEventListener('click', function() {
        FileService.exportGraphMl(window.graph.graphVertices, window.graph.graphEdges);
    });