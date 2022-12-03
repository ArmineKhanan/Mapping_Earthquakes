// We create the layers that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

//mapbox://styles/mapbox/navigation-day-v1

let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [9, 0],
	zoom: 2,
	layers: [streets]
})

// Create a base layer that holds both maps.
let baseMaps = {
	"Streets": streets,
	"Satellite": satelliteStreets,
	"Dark": dark
  };

// Create the earthquake and tectonic plate layer for the map.
let earthquakes = new L.layerGroup();
let tectonicPlates = new L.layerGroup();
let majorEarthquakes = new L.layerGroup();


let overlays = {
	"Earthquakes": earthquakes,
	"Tectonic Plates": tectonicPlates,
  "Major Earthquakes": majorEarthquakes
  };



// Then we add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);


// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into two separate functions
// to calculate the color and radius.
function styleInfo(feature) {
	return {
	  opacity: 1,
	  fillOpacity: 0.7,
	  fillColor: getColor(feature.properties.mag),
	  color: "#ff0000",
	  radius: getRadius(feature.properties.mag),
	  stroke: true,
	  weight: 0.5
	};
  }
 
// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
	if (magnitude > 5) {
	  return "#ff2424";
	}
	if (magnitude > 4) {
	  return "#ff4747";
	}
	if (magnitude > 3) {
	  return "#ff6b6b";
	}
	if (magnitude > 2) {
	  return "#ff8f8f";
	}
	if (magnitude > 1) {
	  return "#ffb3b3";
	}
	return "#ffd6d6";
  }  

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
	if (magnitude === 0) {
	  return 1;
	}
	return magnitude * 3;
  }  

// Creating a GeoJSON layer with the retrieved data.
L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
        console.log(data);
        return L.circleMarker(latlng);
      },
    // Set the style for each circleMarker using our styleInfo function.
  style: styleInfo,
    // Create a popup for each circleMarker to display the magnitude
    onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
}).addTo(earthquakes);
	
	// Add the earthquake layer to the map.
	earthquakes.addTo(map);
}); 

// CORE CODE FOR DELIVERABLE 1
// 3. Retrieve the major earthquake GeoJSON data >4.5 mag for the week.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(data) {

// 4. Use the same style as the earthquake data.
function styleInfo(feature) {
	return {
	  opacity: 1,
	  fillOpacity: 0.7,
	  fillColor: getColor(feature.properties.mag),
	  color: "#a5081a",
	  radius: getRadius(feature.properties.mag),
	  stroke: true,
	  weight: 0.5
	};
  }

// 5. Change the color function to use three colors for the major earthquakes based on the magnitude of the earthquake.
function getColor(magnitude) {
	if (magnitude > 6) {
	  return "#ff0000";
	}
	if (magnitude > 5) {
	  return "#ff2424";
	}
	if (magnitude <= 5) {
	  return "#ff4747";
	}
  }  

// 6. Use the function that determines the radius of the earthquake marker based on its magnitude.
function getRadius(magnitude) {
	if (magnitude === 0) {
	  return 1;
	}
	return magnitude * 3;
  }  

// 7. Creating a GeoJSON layer with the retrieved data that adds a circle to the map 
// sets the style of the circle, and displays the magnitude and location of the earthquake
//  after the marker has been created and styled.
L.geoJson(data, {
  pointToLayer: function(feature, latlng) {
    console.log(data);
    return L.circleMarker(latlng);
  },
  style: styleInfo,
  onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
}).addTo(majorEarthquakes);
// 8. Add the major earthquakes layer to the map.
majorEarthquakes.addTo(map);
// 9. Close the braces and parentheses for the major earthquake data.
});


//__________//



// Create a legend control object.
let legend = L.control({
	position: "bottomright"
  });

// Then add all the details for the legend.
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");

  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
	"#98ee00",
	"#d4ee00",
	"#eecc00",
	"#ee9c00",
	"#ea822c",
	"#ea2c2c"
  ];

// Looping through our intervals to generate a label with a colored square for each interval.
for (var i = 0; i < magnitudes.length; i++) {
  console.log(colors[i]);
  div.innerHTML +=
    "<i style='background: " + colors[i] + "'></i> " +
    magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
  }
  return div;
};

legend.addTo(map);


// CORE CODE FOR DELIVERABLE 1
let lineStyle = {
	color: "#a5081a",
	weight: 1,
  fillOpacity: 1
};

// Grab tectonic plate boundary GeoJSON data
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data) {
	console.log(data);

	// Create a GeoJSON layer with the retrieved data
	L.geoJson(data, {
		style: lineStyle
	}).addTo(tectonicPlates);

	// Add tectonic plates layer to map
	tectonicPlates.addTo(map);

});