function findShortestPath(graphData, startNode, endNode) {
    const distances = {};
    const previous = {};
    const remainingNodes = new Set();


for (let i = 0; i < graphData.nodes.length; i++) {
    const node = graphData.nodes[i];
    distances[node] = Infinity;
    previous[node] = null;
    remainingNodes.add(node);
}

    distances[startNode] = 0;

    while (remainingNodes.size > 0) {
        let closest = null;
        let minDist = Infinity;

        for (let node of remainingNodes) {
            if (distances[node] < minDist) {
                minDist = distances[node];
                closest = node;
            }
        }

        if (closest === null || distances[closest] === Infinity) {
            break;
        }

        if (closest === endNode) {
            break;
        }

        remainingNodes.delete(closest);

        const neighbors = graphData.edges[closest] || [];

        for (let edge of neighbors) {
            const neighbor = edge.node;  
            const weight = edge.weight;    

            const newDist = distances[closest] + weight;

            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist; 
                previous[neighbor] = closest;  
            }
        }
    }

    if (distances[endNode] === Infinity) {
        return { path: [], distance: Infinity };
    }

    const path = [];
    let current = endNode;

    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }
    
    return { path: path[0] === startNode ? path : [], distance: distances[endNode]
    };
}