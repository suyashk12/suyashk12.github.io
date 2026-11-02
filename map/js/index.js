// Image layers ================================================================
const J0110_MUSE_gr = L.tileLayer("J0110_MUSE_gr/{z}/{y}/{x}.png", { attribution:"<a href='https://github.com/ryanhausen/fitsmap'>FitsMap</a>", minZoom: 0, maxZoom: 6, maxNativeZoom: 1 });

// Marker layers ===============================================================

// Basic map setup =============================================================
L.CRS.FitsMap = L.extend({}, L.CRS.Simple, {
    transformation: new L.Transformation(1/2, 0, -1/2, 256)
});

const map = L.map("map", {
    crs: L.CRS.FitsMap,
    minZoom: 0,
    preferCanvas: true,
    layers: [J0110_MUSE_gr]
});

// Scale Bar Control ===========================================================
// https://stackoverflow.com/a/62093918
const scale = L.control.fitsmapScale({
    pixelScale: 1.0,
    unitsArePixels: true,
}).addTo(map);

// Label Control ===============================================================
const label = L.control.label({
    position: 'bottomleft',
    title: '',
    isRADec: Boolean(is_ra_dec) // from urlCoords.js
}).addTo(map);

const catalogs = {

};

const layerControl = L.control.layers(
    {"J0110_MUSE_gr":J0110_MUSE_gr},
    catalogs
).addTo(map);

// Search ======================================================================


// Settings Control ============================================================
const settingsControl = L.control.settings({
    position: 'topleft',
    catalogs:catalogs,
}).addTo(map);

// Map event setup =============================================================
J0110_MUSE_gr.on("load", () => {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("map").style.visibility = "visible";
    label.update(map.getCenter());
});

map.on("moveend", updateLocationBar);
map.on("zoomend", updateLocationBar);
map.on("mousemove", (event) => {label.update(event.latlng);});
map.on("baselayerchange", (event) => {label.options.title = event.name;});

map.whenReady(function () {
    scale.options.maxWidth = Math.round(map.getSize().x * 0.2);
    label.addTo(map);
});

if (urlParam("zoom")==null) {
    map.fitBounds(L.latLngBounds([[0, 0], [347, 350]]));
} else {
    panFromUrl(map);
}