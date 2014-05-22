// Styjed TopoJSON-aware Leaflet layer

/*
You'll need something like this in your HTML:
<script src="http://d3js.org/topojson.v1.min.js"></script>
<script src="http://d3js.org/queue.v1.min.js"></script>
<script src="./js/dust-core.min.js"></script>
jquery
*/


var styles 	= [];
var legends = {};
var credits = [];

var hide_legends = 1;

function ToggleLegend() {
	console.log("TG "+ hide_legends)
	if( hide_legends == 1 ) {	// turn it on
		hide_legends = 0;
		for( var i in legends ) {
			if( legends[i].display ) {	// if layer is turned on
				console.log("TG Show:"+legends[i].legend)
				//$('#'+legends[i].legend).show();
			} else {
				console.log("TG Not Show:"+legends[i].legend)
			}
		}
	} else {					// turn it off
		hide_legends = 1
		for( var i in legends ) {
			//$('#'+legends[i].legend).hide();
		}
	}
}

//
// Pre-Compile a style template using dust
//
function compileStyle( id, style ) {
	// check if style has already been compiled
	if( styles.indexOf(id) >=0 ) {
		return
	}
	
	// compile templates		
	for( var k in style) {
		var option	= id + "_" + k
		var compiled = dust.compile(k, option)
		dust.loadSource(compiled);
	}
	
	// add it to array
	styles.push(id)
}

//
// Load topojson from url
function loadDataUrl(http, url, cb) {
	var promise = http.get( url)
	
	promise.success( function(data) {
		console.log("success:"+url, data)
		cb(null, data)
	})
	
	promise.error( function(data, status, headers, config ) {
		console.log("Error getting "+url)
		cb(-1)
	})
}
//
// Load Mapinfo Object
//
function loadMapObject( http, mapObject, cb ) {
	if( mapObject === undefined )  return cb(null, null)
	if( mapObject.loaded == true ) return cb(null, mapObject)
	
	var id 		= mapObject.id;
	var name 	= mapObject.displayName;
	
	var promise = http({
		url: 	mapObject.url,
		method: mapObject.method
		//dataType: mapObject.mediaType
	})
	promise.success( function(data) {
		console.log("success:"+id)
		switch(name) {
			case "style":
				compileStyle(id, data);
				styles.push(id);
				break;
			case "legend":
				// add it to the legend div
				//$('#legends').append(data)
				break;
			case "credits":
				credits.push(id)
				break;
		}
		cb(null, data);
	})
	
	promise.error( function(data, status, headers, config) {
		console.log("Error loading MapObject:"+id);
		cb(-1)
	});	
}

//
// Return matching style for feature with specific properties
//

function styleFeature( feature, id, style ) {
	if( !style ) {
		console.log("using default styling");
		return { color: '#ff0000', weight: 1 }
	}
	
	// find matching style
	var foundStyle = undefined;
	
	for( var k in style) {
		var option = id + "_" + k;
		dust.render(option, feature.properties, function(err, out) {
			try {
				var result = eval(out);
				if( result ) {
					var index = option.replace(id+"_", "");
					foundStyle = style[index];
				}
			} catch(e) {
				console.log("Exception checking style:"+e);
				console.log("Err/out",err, out);
				console.log("props:"+JSON.stringify(feature.properties));
			}
		})
		if( foundStyle ) break;
	}
	return foundStyle;
}


function loadData( http, topojsonUrl, displayName, mapinfos, map, cb ) {
	var legendObject, styleObject, creditObject;
	var styleId;
	
	console.log("load topojson:"+topojsonUrl);
	
	if( mapinfos ) {
		for( var el in mapinfos) {
			var name 	= mapinfos[el].displayName;
			var id		= mapinfos[el].id;
			switch( name ) {
				case "legend":
					legendObject 	= mapinfos[el];
					legendObject.id = id;
					for( var i in legends) {
						if( legends[i].legend == id ) {
							legendObject.loaded = true
							break;
						}
					}
					legendObject.loaded = false
					break;
				case "style":
					styleObject = mapinfos[el];
					styleId = mapinfos[el].id
					if( styles.indexOf(id) < 0 ) {
						styleObject.loaded = false
					} else {
						styleObject.loaded = true
					}
					break;
				case "credits":
					creditObject = mapinfos[el];
					if( credits.indexOf(id) >= 0 ) {
						creditObject.loaded = true
					} else {
						creditObject.loaded = false
					}
					break;
			}
		}
	}
	
	queue()
    	.defer(loadDataUrl, http, topojsonUrl)
	    .defer(loadMapObject, http, styleObject)
    	.defer(loadMapObject, http, legendObject)
	    .defer(loadMapObject, http, creditObject)
	    .await(function(error, data, styleData, legendData, creditsData) { 
			console.log("await done", error, data.objects.length)
			if( !error ) {
				//var topoJsonLayer = new L.TopoJSON(null)
				for (var key in data.objects) {
					console.log("layer", key)
					var geodata = topojson.feature(data, data.objects[key]);
					var attribution=""
					if( creditsData ) {
						attribution = creditsData.credits;
					}
					
					var layer = L.geoJson(geodata, {
						style: function(feature) {
						 	return styleFeature( feature, styleId, styleData );
						},
						onEachFeature: function(feature, layer) {
							var html = "<br/><table>"
							for( var i in feature.properties ) {
								html += "<tr><td>"+i+":&nbsp; </td><td>"+feature.properties[i]+"</td></tr>"
							}
							html += "</table"
							layer.bindPopup( html)
						},
						attribution: attribution
					})
				
					
					// Add to map
					console.log("add layer to map", layer)
					layer.addTo(map)		
				
					// Add it to the Layer control widget
					var layerName = key;
					
					// Remember the layer to legend mapping if we haveone
					//if( legendObject ) {
					//	legends[layerName] = { legend: legendObject.id, display: true };
					//}
					
					//var credits = L.control.attribution().addTo(map);
					var creditsHtml = "<a href='"+creditsData.url+"'>"+creditsData.credits+"</a>"
					//credits.addAttribution(html);
					
					//var legendControl = map.addControl(L.mapbox.legendControl());
					//legendControl.addLegend(legendData)
					
					//map_controls.addOverlay(geoJsonLayer, layerName)	
					cb(layer, legendData, creditsHtml);
				}
			} else {
				console.log("Error getting mapinfos")
			}
		});
}