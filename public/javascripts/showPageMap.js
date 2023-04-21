mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'show-map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: campground.geometry.coordinates,
    zoom: 9,
});

const marker = new mapboxgl.Marker({
    color: "#FFFFFF",
    draggable: false
}).setLngLat(campground.geometry.coordinates)
    .addTo(map);

const popup = new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat(campground.geometry.coordinates)
    .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
    .addTo(map);

    map.addControl(new mapboxgl.NavigationControl());