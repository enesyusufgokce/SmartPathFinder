const MENTESE_COORDS = [37.174, 28.366];
var map = L.map('map').setView(MENTESE_COORDS, 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let graphData = null;
let selectedNodes = []; 
let markers = [];
let polylines = [];

fetch('graph-data.json').then(res => res.json()).then(data => { 
    graphData = data; 
});

map.on('click', function(e) {
    if (!graphData) return;

    let nodeId = findNearestNode(e.latlng);
    let nodeCoord = graphData.coordinates[nodeId];
    
    let marker = L.marker([nodeCoord[0], nodeCoord[1]])
        .bindTooltip("Stop " + (selectedNodes.length + 1), {permanent: true})
        .addTo(map);
    
    markers.push(marker);
    selectedNodes.push(nodeId);
    document.getElementById('info').innerText = selectedNodes.length + " stops added to list.";
});

function calculateFullRoute() {
    if (selectedNodes.length < 2) {
        alert("Select at least 2 points to create a path!");
        return;
    }

    polylines.forEach(p => map.removeLayer(p));
    polylines = [];
    
    let totalDist = 0;

    for (let i = 0; i < selectedNodes.length - 1; i++) {
        let result = findShortestPath(graphData, selectedNodes[i], selectedNodes[i+1]);
        
        if (result.path && result.path.length > 0) {
            totalDist += result.distance;
            let segmentCoords = result.path.map(id => graphData.coordinates[id]);
            
            let line = L.polyline(segmentCoords, {
                color: '#e74c3c', 
                weight: 6, 
                opacity: 0.8
            }).addTo(map);
            
            polylines.push(line);
        }
    }

    document.getElementById('result').innerText = `Total Final Path: ${totalDist.toFixed(2)} meters`;
}

function findNearestNode(latlng) {
    let minDest = Infinity;
    let nearest = null;
    for (let id in graphData.coordinates) {
        let coord = graphData.coordinates[id];
        let dist = L.latLng(latlng).distanceTo(L.latLng(coord[0], coord[1]));
        if (dist < minDest) {
            minDest = dist;
            nearest = id;
        }
    }
    return nearest;
}

function resetMap() {
    markers.forEach(m => map.removeLayer(m));
    polylines.forEach(p => map.removeLayer(p));
    markers = [];
    selectedNodes = [];
    polylines = [];
    document.getElementById('result').innerText = "";
    document.getElementById('info').innerText = "Stops cleared. Start selecting again.";
}