export function sectionHeader(text) {
    var l = "\\[\\large{\\text{" + text + "}} \\]";
    return l;
}
export function showGraphMinDegree() {
    var vertices = window.graph.graphVertices;
    var minDeg = Infinity;
    vertices.forEach(function(v) {
        if (v.degree < minDeg) minDeg = v.degree;
    });

    var l = "";
    if (vertices.length)
        l += "\\[\\delta(G)=" + minDeg + "\\]";
    else l += "\\[G \\hspace{10px} is \\hspace{10px} null\\]";

    return l;
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
}

export function getVertexId(vertex) {
    var v = "\\[" + "v_{" + vertex.id + "}" + "\\]";
    return v;
}

export function getVertexDegree(vertex) {
    var l = "\\[\\delta_{G}(" + "v_{" + vertex.id + "}" + ")=" + vertex.degree + "\\]";
    return l;
}

function vertexNeighborhood(vertex) {
    var edges = vertex.edges || [];
    return edges.map((it) => it.target.id != vertex.id ? it.target.id : it.source.id);
}

export function getVertexNeighborhood(vertex) {
    var neighborhood = vertexNeighborhood(vertex);
    // console.log("getVertexNeighborhood", { neighborhood });
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

    // console.log("getVertexNeighborhood 2", { neighborhood, e });
    return e;
}

export function showGraphRegular() {
    var vertices = window.graph.graphVertices;
    var degSeq = vertices.map(function(v) {
        return v.degree;
    });
    //sort in decreasing order
    degSeq.sort(function(a, b) {
        return b - a;
    });
    //test if graph is regular
    var flag = false;
    if (degSeq.length > 0) flag = true;
    for (var i = 0; i < degSeq.length - 1; i++) {
        if (degSeq[i] != degSeq[i + 1]) {
            flag = false;
            break;
        }
    }
    var l = "";

    // var l = "\\[\\text{Degree Sequence}=(";
    // degSeq.forEach(function(d, i) {
    //     if (i !== degSeq.length - 1) l += d + ",";
    //     else l += d;
    //     if (i % 15 == 14) l += "\\\\";
    // });
    // l += ")\\]";
    if (flag) {
        l +=
            "\\[\\text{Grafo é \\(" +
            degSeq[0] +
            "\\)-regular de ordem }" +
            degSeq.length +
            "\\]";
    } else {
        l += "\\[\\text{Grafo não é k-regular.}\\]";
    }
    return l;
}

export function showGroups(vertices, edges) {
    var v = "\\[V=\\{";
    for (let i = 0; i < vertices.length; i++) {
        if (i == 0) v += "v_{" + vertices[i].id + "}";
        else v += "," + "v_{" + vertices[i].id + "}";
        if ((i + 1) % 15 == 0) v += "\\\\";
    }
    v += "\\}\\]";


    var e = "\\[E=\\{";
    for (let i = 0; i < edges.length; i++) {
        if (i == edges.length - 1)
            e += "(" + "v_{" + edges[i].source.id + "}" + "v_{" + edges[i].target.id + "}" + ")";
        else
            e += "(" +
            "\\color{" + "0" + "}{v_{" +
            edges[i].source.id +
            "}}" +
            "v_{" +
            edges[i].target.id +
            "}" +
            ")" + ",";
        if ((i + 1) % 10 == 0) e += "\\\\";
    }
    e += "\\}\\]";

    e += "\\[\\text{|V| = }" + vertices.length + "\\]";
    e += "\\[\\text{|E| = }" + edges.length + "\\]";

    return v + e;
}

export function showAdjacencyMatrix() {
    var vertices = window.graph.graphVertices;
    var edges = window.graph.graphEdges;

    var l = "";
    l += "\\[\\text{Matriz de adjacência}\\]"
    l += "\\[\\begin{pmatrix}";
    var a = [];
    for (let i = 0; i < vertices.length; i++) {
        for (let j = 0; j < vertices.length; j++) {
            var value;
            if (i == j) {
                value = 0
            } else {
                value = vertices[i].edges.filter((e) => e.source.id == vertices[j].id || e.target.id == vertices[j].id).length > 0 ? 1 : 0;
            }
            var and = j == vertices.length - 1 ? "" : " & ";
            l += "" + value + and;
        }
        l += "\\";
        l += "\\";
    }

    l += "\\end{pmatrix}\\]";

    return l;
}

export function greedyColoring(vertices) {
    const colors = vertices.map((it, index) => index);
    const colorsResult = [];
    var result = [];
    vertices.forEach((v) => {
        const usedColors = [];
        v.edges.forEach((edge, i) => {
            var neighbour = vertices.find((it, _) => it.id == edge.target.id || it.id == edge.source.id);
            usedColors.push(neighbour.color);

        });

        var color = colors.find((it, _) => !usedColors.includes(it));

        if (colorsResult.indexOf(color) === -1) colorsResult.push(color);

        v.color = color;
        result.push(v);
    });

    window.graph.graphVertices = result;
    window.graph.chromaticNumber = colorsResult.length;

    // console.log("GREEDY/final", {
    //     result,
    //     colors,
    //     graph: window.graph,
    //     colorsResult,
    // });
    window.graph.toggleColors();
}

export function resetColoring(vertices) {
    window.graph.graphVertices = vertices.map((e) => ({...e, color: null }));
    window.graph.toggleColors();
    window.graph.chromaticNumber = 0;
}

export function showChromaticNumber(chromaticNumber) {
    // var l = "\\[\\text{Número crômatico é } \\chi = " + chromaticNumber + "\\]";
    var l = "\\[\\chi = " + chromaticNumber + "\\]";
    return l;
}

export function showBiparte(isBipartite) {
    var vertices = window.graph.graphVertices;

    var l = "";

    if (isBipartite) {
        var setA = "",
            setB = "";
        var countA = 0,
            countB = 0;
        vertices.forEach(function(v) {
            if ((v.color % 2) == 0) {
                countA++;
                setA += "v_{" + v.id + "},";
                if (countA % 12 == 0) setA += "\\\\";
            } else if ((v.color % 2) == 1) {
                countB++;
                setB += "v_{" + v.id + "},";
                if (countB % 12 == 0) setB += "\\\\";
            }
        });

        //modify sets to make Latex text look nicer
        if (countA % 12 == 0) {
            setA = setA.slice(0, -3);
        } else {
            setA = setA.slice(0, -1);
        }

        if (countB % 12 == 0) {
            setB = setB.slice(0, -3);
        } else {
            setB = setB.slice(0, -1);
        }
        l += "\\[\\text{O grafo é bipartido!}\\]";
        l += "\\[\\text{Conjunto } A = \\{" + setA + "\\} \\]";
        l += "\\[\\text{Conjunto } B = \\{" + setB + "\\} \\]";
    } else if (isBipartite != false) {
        l = "\\[\\text{O grafo não é bipartido.}\\]";
    } else l = "\\[\\text{O grafo não é bipartido.}\\]";

    return l;
}

export function checkComponents() {
    var vertices = window.graph.graphVertices;
    var edges = window.graph.graphEdges;
    if (vertices.length == 0) {
        componentCount = 0;
        return showComponents(componentCount);
    }

    componentCount = 1;

    //construct adjacency list of graph
    var adjList = {};
    vertices.forEach(function(v) {
        v.visited = false;
        adjList[v.id] = [];
    });
    edges.forEach(function(e) {
        adjList[e.source.id].push(vertices.find((v) => v.id == e.target.id));
        adjList[e.target.id].push(vertices.find((v) => v.id == e.source.id));
    });

    //perform DFS on vertices
    var q = [];
    q.push(vertices[0]);

    while (q.length > 0) {
        var v1 = q.shift();
        var adj = adjList[v1.id];

        for (let i = 0; i < adj.length; i++) {
            var v2 = adj[i];
            if (v2.visited) continue;
            q.push(v2);
        }

        v1.visited = true;
        v1.componentId = componentCount;
        //check for unvisited vertices
        if (q.length == 0) {
            for (let i = 0; i < vertices.length; i++) {
                if (!vertices[i].visited) {
                    q.push(vertices[i]);
                    componentCount++;
                    break;
                }
            }
        }
    } //while ends here

    // vertices.style("fill", function(d) {
    //     return colors[d.componentId % 10];
    // });
    return showComponents(componentCount);
}

function showComponents(componentCount) {
    var l = "";
    if (componentCount == 0) l = "\\[\\text{Grafo não contém nenhum componente.}\\]";
    else if (componentCount == 1)
        l =
        "\\[\\text{O grafo tem somente um componente.}\\]";
    else
        l =
        "\\[\\text{O grafo tem " +
        componentCount +
        " componentes. É um grafo desconexo.}\\]";
    return l;
}

export function showCompleteGraph() {
    var l = "";

    var degSeq = window.graph.graphVertices.map(function(v) {
        return v.degree;
    });
    //sort in decreasing order
    degSeq.sort(function(a, b) {
        return b - a;
    });

    var order = window.graph.graphVertices.length,
        size = window.graph.graphEdges.length;
    if (order > 0 && 2 * size == order * (order - 1)) {
        l +=
            "\\[\\text{É um grafo completo (}" +
            "K_{" +
            degSeq.length +
            "} \\text{).}\\]";
    } else {
        l += "\\[\\text{Não é um grafo completo.}\\]";
    }
    return l;
}

export function showTrivialGraph() {
    var vertices = window.graph.graphVertices;
    var isTrivial = vertices.length == 1;
    if (isTrivial) {
        return "\\[\\text{É um grafo trivial.}\\]";
    }
    return "\\[\\text{Não é um grafo trivial.}\\]"
}


function checkCycle() {
    var vertices = window.graph.graphVertices;
    var edges = window.graph.graphEdges;
    if (edges.length == 0) return false;

    //construct adjacency list of graph
    //vis keeps track of visited node ids
    var adjList = {},
        vis = {},
        parent = {};
    vertices.forEach(function(v) {
        v.visited = false;
        adjList[v.id] = [];
        vis[v.id] = false;
    });
    edges.forEach(function(e) {
        adjList[e.source.id].push(e.target.id);
        adjList[e.target.id].push(e.source.id);
    });

    //perform DFS on vertices
    var q = [vertices[0].id];
    //-1 means root
    parent[vertices[0].id] = -1;
    var v1, v2;

    while (q.length > 0) {
        v1 = q.shift();
        vis[v1] = true;
        for (let i = 0; i < adjList[v1].length; i++) {
            v2 = adjList[v1][i];
            if (vis[v2] && parent[v1] != v2) return true;
            if (!vis[v2]) {
                q.push(v2);
                parent[v2] = v1;
            }
        }
    }

    //check for other components
    if (q.length == 0) {
        for (let v in vis) {
            if (!vis[v]) {
                q.push(v);
                parent[v] = -1;
                break;
            }
        }
    }
    return false;
}

export function showCycles() {
    var vertices = window.graph.graphVertices;
    var edges = window.graph.graphEdges;
    var l = "";

    //construct adjacency list of graph
    //vis keeps track of visited node ids
    var adjList = {},
        vis = {},
        parent = {};
    vertices.forEach(function(v) {
        v.visited = false;
        adjList[v.id] = [];
        vis[v.id] = false;
    });
    edges.forEach(function(e) {
        adjList[e.source.id].push(e.target.id);
        adjList[e.target.id].push(e.source.id);
    });

    //perform DFS on vertices
    var q = [vertices[0].id];
    //-1 means root
    parent[vertices[0].id] = -1;
    var v1, v2;

    var cycles = 0;
    while (q.length > 0) {
        v1 = q.shift();
        vis[v1] = true;
        for (let i = 0; i < adjList[v1].length; i++) {
            v2 = adjList[v1][i];
            if (vis[v2] && parent[v1] != v2) {
                cycles += 1;
            }
            if (!vis[v2]) {
                q.push(v2);
                parent[v2] = v1;
            }
        }

        //check for other components
        if (q.length == 0) {
            for (let v in vis) {
                if (!vis[v]) {
                    q.push(v);
                    parent[v] = -1;
                    break;
                }
            }
        }
    } //while ends here
    if (cycles == 0) {
        l += "\\[\\text{O grafo não tem ciclos}\\]";
    } else {
        l += "\\[\\text{O grafo tem " +
            cycles +
            " ciclos.}\\]";
    }

    return l;
}
export function showTrees() {
    var vertices = window.graph.graphVertices;
    var edges = window.graph.graphEdges;

    var l = "";

    if (vertices.length == 0) l = "\\[\\text{Não é uma árvore.}\\]";
    else if (checkCycle()) l = "\\[\\text{Não é uma árvore. Grafo não é acíclico.}\\]";
    else if (vertices.length == edges.length + 1)
        l =
        "\\[\\text{É uma árvore.}\\]";
    else l = "\\[\\text{É uma floresta.}\\]";

    return l;
}