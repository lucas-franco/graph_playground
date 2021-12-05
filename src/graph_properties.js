//shows max and min degree of graph
export function showGraphMinDegree() {
    var vertices = window.graph.graphVertices;
    var minDeg = Infinity;
    vertices.forEach(function(v) {
        if (v.degree < minDeg) minDeg = v.degree;
    });

    var l;
    if (vertices.length)
        l = "\\[\\delta(G)=" + minDeg + "\\]";
    else l = "\\[G \\hspace{10px} is \\hspace{10px} null\\]";

    return l;
    document.getElementById("svg-output").textContent += l;
}

export function showGraphMaxDegree() {
    var vertices = window.graph.graphVertices;
    var maxDeg = 0;
    vertices.forEach(function(v) {
        if (v.degree > maxDeg) maxDeg = v.degree;
    });

    var l;
    if (vertices.length)
        l = "\\[\\Delta(G)=" + maxDeg + "\\]";
    else l = "\\[G \\hspace{10px} is \\hspace{10px} null\\]";

    return l;
    document.getElementById("svg-output").textContent += l;
}

export function getVertexId(vertex) {
    var v = "\\[" + "v_{" + vertex.id + "}" + "\\]";
    return v;
}

export function getVertexDegree(vertex) {
    var l = "\\[\\delta_{G}(" + "v_{" + vertex.id + "}" + ")=" + vertex.degree + "\\]";
    return l;
}

export function getVertexNeighborhood(vertex) {
    var edges = vertex.edges;
    var neighborhood = edges.map((it) => it.target != vertex.id ? it.target : it.source);
    console.log("getVertexNeighborhood", { edges, neighborhood });
    var e = "\\[\\Gamma_{G}(v_{" + vertex.id + "})=\\{";
    for (let i = 0; i < neighborhood.length; i++) {
        if (i == neighborhood.length - 1)
            e += "v_{" + neighborhood[i] + "}";
        else
            e += "v_{" + neighborhood[i] + "}" + ",";
        //add line break
        if ((i + 1) % 10 == 0) e += "\\\\";
    }
    e += "\\}\\]";

    console.log("getVertexNeighborhood 2", { edges, neighborhood, e });
    return e;
}

export function showGraphRegular() {
    return "Em desenvolvimento :)";
    document.getElementById("svg-output").textContent += "Em desenvolvimento :)";
}

export function showGroups(vertices, edges) {
    var v = "\\[V=\\{";
    for (let i = 0; i < vertices.length; i++) {
        if (i == 0) v += "v_{" + vertices[i].id + "}";
        else v += "," + "v_{" + vertices[i].id + "}";
        //add line break
        if ((i + 1) % 15 == 0) v += "\\\\";
    }
    v += "\\}\\]";

    var e = "\\[E=\\{";
    for (let i = 0; i < edges.length; i++) {
        if (i == edges.length - 1)
            e += "(" + "v_{" + edges[i].source + "}" + "v_{" + edges[i].target + "}" + ")";
        else
            e += "(" +
            "v_{" +
            edges[i].source +
            "}" +
            "v_{" +
            edges[i].target +
            "}" +
            ")" + ",";
        //add line break
        if ((i + 1) % 10 == 0) e += "\\\\";
    }
    e += "\\}\\]";

    return v + e;
    document.getElementById("svg-output").textContent += v + e;
    //recall mathjax
}