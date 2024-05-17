
mapboxgl.accessToken = mapToken; // Setting your Mapbox access token
// Creating a new map
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // centering the map at the coordinates of the listing
    zoom: 8 // zoom level
});

// Adding a marker to the map at the listing's coordinates
const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates) // setting marker position
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // adding popup to marker
        .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`)) // setting popup content
    .addTo(map); // adding marker to map
    function resizeMap() {
        const mapContainer = document.getElementById('map');
        const mapWidth = mapContainer.offsetHeight * 0.8; // 80% of the viewport height
        const mapHeight = mapContainer.offsetHeight;
    
        map.resize();
        mapContainer.style.width = mapWidth + 'px'; // Set map container width
    }
    