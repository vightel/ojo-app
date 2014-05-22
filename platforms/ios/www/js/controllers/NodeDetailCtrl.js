//
// NodeDetail Controller
//
app.controller('NodeDetailCtrl', function($scope, $stateParams, Nodes, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $http) {

	$scope.node 				= Nodes.get($stateParams.nodeId);
	var region 					= $scope.node;
	var id_property				= "0"
	var date_property 			= "1"
	var trigger_property 		= "2"
	var fatalities_property		= "3"
	var loc_acc_property		= "4"
	var landslide_size_property	= "5"
	var storm_property			= "6"
	var landslide_type_property	= "7"
		
	var map 	= L.mapbox.map('map', region.map_id, { 
		minZoom: 			region.min_zoom, 
		maxZoom: 			region.max_zoom,
        attributionControl: false,
		zoomControl: 		false,
		infoControl: 		false
	    //,tileLayer: {
	    //       detectRetina: true
	    //   }
	})
	.setView(region.target, region.min_zoom);   
	
	var landslideMarkers = new L.MarkerClusterGroup();

	$scope.showMenu = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
   
	$scope.layers = {
		landslideCatalog: {
			name: "Landslide Catalog",
			checked: false,
			layer: undefined,
			legend: undefined,
			showLegend: false,
			credits: undefined,
			infoControl: undefined
		},
		landslideRisk: {
			name: "Landslide Risk",
			checked: false,
			layer: undefined,
			legend: undefined,
			showLegend: false,
			credits: undefined,
			infoControl: undefined
		},
		landslideSusceptibility: {
			name: "Landslide Susceptibility",
			checked: false,
			layer: undefined,
			legend: undefined,
			showLegend: false,
			credits: undefined,
			infoControl: undefined
		},
		dailyPrecip: {
			name: "Daily Precipitation",
			checked: false,
			layer: undefined,
			legend: undefined,
			showLegend: false,
			credits: undefined,
			infoControl: undefined
		},
		precipForecast: {
			name: "Precipitation Forecast",
			checked: false,
			layer: undefined,
			legend: undefined,
			showLegend: false,
			credits: undefined,
			infoControl: undefined
		},
		floodRisk: {
			name: "Flood Risk",
			checked: false,
			layer: undefined,
			legend: undefined,
			showLegend: false,
			credits: undefined,
			infoControl: undefined
		},
		floodCatalog: {
			name: "Flood Catalog",
			checked: false,
			layer: undefined,
			legend: undefined,
			showLegend: false,
			credits: undefined,
			infoControl: undefined
		},
		eo1FloodMap: {
			name: "EO-1 Floodmap",
			checked: false,
			layer: undefined,
			legend: undefined,
			showLegend: false,
			credits: undefined,
			infoControl: undefined
		}
	}
	
	var slides = []
	for( var k in $scope.layers ) {
		slides.push(k);
	}
	
	// Called each time the slide changes
	$scope.slideChanged = function(index) {
		$scope.slideIndex 	= index;
		
		var layerEntry 		= slides[index]
		$scope.currentLayer	= $scope.layers[layerEntry]
		
		console.log("slide", index, $scope.currentLayer.name)	
	};
	
	$scope.CreditClick = function() {
		console.log("Credit Click")
		if( $scope.currentLayer.credits ) {
			if( $scope.currentLayer.infoControl) {
				map.removeControl( $scope.currentLayer.infoControl )
				$scope.currentLayer.infoControl = undefined
			} else {
				$scope.currentLayer.infoControl = L.mapbox.infoControl();
				$scope.currentLayer.infoControl.addInfo($scope.currentLayer.credits);
				map.addControl( $scope.currentLayer.infoControl )
			}
		} else {
			console.log("Could not find credits for layer", $scope.currentLayer.name)
		}
	}
	$scope.LegendClick = function() {
		console.log("Legend Click")
		if( $scope.currentLayer.legend != undefined) {
			if( $scope.currentLayer.showLegend) {
				map.legendControl.removeLegend( $scope.currentLayer.legend )
				$scope.currentLayer.showLegend = false;				
			} else {
				map.legendControl.addLegend( $scope.currentLayer.legend )
				$scope.currentLayer.showLegend = true;
			}
		} else {
			console.log("Could not find legend for layer",$scope.currentLayer.name)
		}
	}
    
	function buildLandslideCatalogLayer() {
		var url = config.streamer_url + "/data/landslides?bbox="+region.bbox

		// Landslide Catalog
		var responsePromise = $http({method: 'GET', url: url });
		
		responsePromise.success( function(data, status) {
			var url 	= config.streamer_url
			console.log('succeeded...', data.features.length);
			
			var layer = L.geoJson(data, {
				onEachFeature: function (feature, layer) {
					var lon		= feature.geometry.coordinates[0]
					var lat 	= feature.geometry.coordinates[1]
					var link	= "img/landslide.png"
					//console.log( "feature:", feature.properties[id_property])
					var popupContent =  "<table><tr><td><img src='"+link+"' width=64 /></td>"+
										"<td><h4>Landslide Id: " + feature.properties[id_property] + '</h4></td></tr>' +
										"<tr><td>Date:</td><td>"+feature.properties[date_property]+"</td></tr>" +
										"<tr><td>Trigger:</td><td>"+feature.properties[trigger_property]+"</td></tr>" +
										"<tr><td>Fatalities:</td><td>"+feature.properties[fatalities_property]+"</td></tr>" +
										"<tr><td>Location Accuracy:</td><td>"+feature.properties[loc_acc_property]+"</td></tr>" +
										"<tr><td>Landslide Size:</td><td>"+feature.properties[landslide_size_property]+"</td></tr>" +
										"<tr><td>Landslide Type:</td><td>"+feature.properties[landslide_type_property]+"</td></tr>" +
										"<tr><td>Storm Name:</td><td>"+feature.properties[storm_property]+"</td></tr>" +
										"<tr><td>Coords:</td><td> ["+feature.geometry.coordinates+"]</td></tr>" +
										"<tr><td>All Info:</td><td><a href='" + url + "/data/landslide/"+feature.properties[id_property]+"'>here</a></td></tr>"+
										"</table>"
					layer.bindPopup(popupContent);
				}
			});
			landslideMarkers.addLayer(layer);
			landslideMarkers.addTo(map)
			$scope.layers.landslideCatalog.layer 	= layer;
			$scope.layers.landslideCatalog.credits 	= "NASA GSFC";			
		})
		
		responsePromise.error( function(data, status, headers, config) {
			Alert('Could not get landslide data');
		})
	};

	function buildfloodRiskLayer() {
		var id = "gfms_24_d03_20140429"
		var mapinfos = [
			{
				"objectType": 	"HttpActionHandler",
				"id": 			"gfms_24_legend",
				"method": 		"GET",
				"url": 			"http://localhost:7465/mapinfo/gfms_24/legend",
				"mediaType": 	"test/html",
				"displayName": 	"legend",
			},
			{
				"objectType": 	"HttpActionHandler",
				"id": 			"gfms_24_style",
				"method": 		"GET",
				"url": 			"http://localhost:7465/mapinfo/gfms_24/style",
				"mediaType": 	"application/json",
				"displayName": 	"style",
			},
			{
				"objectType": 	"HttpActionHandler",
				"id": 			"gfms_24_credits",
				"method": 		"GET",
				"url": 			"http://localhost:7465/mapinfo/gfms_24/credits",
				"mediaType": 	"application/json",
				"displayName": 	"credits",
			}
		]

		// pretend that we get a topojson file
		var url = "http://localhost:7465/products/d03/20140429/gfms_24_d03_20140429.topojson"
		var responsePromise = $http({method: 'GET', url: url });
		
		loadData( $http, url, id, mapinfos, map, function(layer, legend, credits) {
			console.log("setting floodRiskLayer")
			$scope.layers.floodRisk.layer 		= layer;
			$scope.layers.floodRisk.credits 	= credits;
			$scope.layers.floodRisk.legend	 	= legend;
		});
	}
	
	function buildEo1FloodMapLayer() {
		// pretend that we get a topojson file
		var url = "http://ojo-bot.herokuapp.com/products/d03/20121209/EO1A0090462012344110KF_water_extent.topojson"
		var responsePromise = $http({method: 'GET', url: url });
		
		responsePromise.success( function(data, status, headers, config) {
			console.log('succeeded...');
			if( data && data.objects ) {
				console.log("Returned good data")
				for( var k in data.objects) {
					var data = topojson.feature(data, data.objects[k]);
		
					var layer =  L.geoJson(null, { style: { color: '#ff0000', weight: 1 }})
					layer.addData(data);
					layer.addTo(map);
					
					$scope.layers.eo1FloodMap.layer 	= layer;
					$scope.layers.eo1FloodMap.credits 	= "NASA GSFC";
					//$scope.layers.eo1FloodMap.legend	= legend;
					
				}
			} else {
				console.log("Did not return good data")
			}
		})

		responsePromise.error( function(data, status, headers, config) {
			Alert('Could not get landslide data');
		})
		
	}
	
	$scope.landslideCatalogChange = function() {
		console.log( "landslideCatalogChange" )
		var checked = !$scope.layers.landslideCatalog.checked
		if( checked ) {
			if( $scope.layers.landslideCatalog.layer == undefined ) {
				buildLandslideCatalogLayer()
			} else {
				// show it
	            map.addLayer(landslideMarkers);
			}
		} else {
			// hide it
			if( $scope.layers.landslideCatalog.layer != undefined ) {
				console.log("remove landslideMarkers")
            	map.removeLayer(landslideMarkers);
			} else {
				console.log("trying to remove landslideMarkers but undefined")
			}
		}
	}
	
	$scope.eo1FloodMapChange = function() {
		console.log( "eo1FloodMapChange" )
		var checked = !$scope.layers.eo1FloodMap.checked
		if( checked ) {
			if( $scope.layers.eo1FloodMap.layer == undefined ) {
				buildEo1FloodMapLayer()
			} else {
				// show it
	            map.addLayer($scope.layers.eo1FloodMap.layer);
			}
		} else {
			// hide it
			if( $scope.layers.eo1FloodMap.layer != undefined ) {
				console.log("remove eo1FloodMapLayer")
            	map.removeLayer($scope.layers.eo1FloodMap.layer);
			} else {
				console.log("trying to remove eo1FloodMapLayer but undefined")
			}
		}
	}

	$scope.landslideSusceptibilityChange = function() {
		console.log( "landslideSusceptibilityChange" )
		var checked = !$scope.layers.landslideSusceptibility.checked
		if( checked ) {
			if( $scope.layers.landslideSusceptibility.layer == undefined ) {
				var susceptibility = "susmap_"+ region.region
				var url = config.tiler_url +"/v2/"+region.bucket+'/'+susceptibility+"/{z}/{x}/{y}.png"
				console.log(url)
				$scope.layers.landslideSusceptibility.layer = new L.TileLayer(url, {tms: true, opacity: 0.5});
	            map.addLayer($scope.layers.landslideSusceptibility.layer);
			} else {
	            map.addLayer($scope.layers.landslideSusceptibility.layer);
			}
		} else {
			// hide it
			if( $scope.layers.landslideSusceptibility.layer != undefined ) {
				console.log("remove landslideSusceptibility layer")
            	map.removeLayer($scope.layers.landslideSusceptibility.layer);
			} else {
				console.log("trying to remove landslideSusceptibility layer but undefined")
			}
		}
	}

	function opensearch( product, scope_layer ) {
		// get a date range
		var endTime 	= moment();
		var startTime	= moment().subtract( 'days', 30)
		 
		var url = config.bot_url+"/products/opensearch?q="+product
		url += "&lat="+region.target[0]
		url += "&lon="+region.target[1]
		url += "&sources=trmm"
		url += "&startTime="+startTime.format("YYYY-MM-DD")
		url += "&endTime="+endTime.format("YYYY-MM-DD")
		url	+= "&limit=1"
		
		//var email = "pat@cappelaere.com"

		var credentials = {
			id:  		fbAppId,
			key: 		fbAccessToken,
			algorithm: 'sha256'
		}
		console.log("Opensearch", fbAppId, fbAccessToken, url)
		
	    var header = hawk.client.header(url, 'GET', { credentials: credentials, ext: email });
		var headers = {'Authorization': header.field }
				
		var responsePromise = $http({method: 'GET', url: url, headers: headers});
		responsePromise.success( function(data, status, headers, config) {
			console.log("opensearch data got:", data.replies.items.length)
			if( data.replies.items.length == 1) {
				var item = data.replies.items[0]
			
				var url = undefined
				for( var i in item.actions.download) {
					var download = item.actions.download[i]
					if( download.displayName == "topojson") {
						url = download.url
					}
				}
			
				if( !url ) {
					console.log("Could not find topojson file to download!")
					return;
				}
			
				var mapinfos 	= item.actions.map;	
				console.log("Found url and mapinfos", url, mapinfos)
				loadData( $http, url, item.id, mapinfos, map, function(layer, legend, credits) {
					console.log("setting Opensearch layer", scope_layer.name)
					scope_layer.layer 	= layer;
					scope_layer.credits = credits;
					scope_layer.legend	= legend;
				});
			}
		})
		
		responsePromise.error( function(data, status, headers, config) {
			console.log('Could not get opensearch data');
		})
	}
	
	function changeLayer( product, scope_layer) {
		var checked = !scope_layer.checked
		if( checked ) {
			if( scope_layer.layer == undefined ) {
				opensearch( product, scope_layer  ) 
			} else {
				// show it
	            map.addLayer(scope_layer.layer);
			}
		} else {
			// hide it
			if( scope_layer.layer != undefined ) {
            	map.removeLayer(scope_layer.layer);
			}
		}
	}
	
	$scope.landslideRiskChange = function() {
		console.log( "landslideRiskChange", $scope.landslideRisk )
		changeLayer( "landslide_risk", $scope.layers.landslideRisk)
	}

	
	$scope.floodRiskChange = function() {
		console.log( "floodRiskChange" )		
		changeLayer( "flood_forecast", $scope.layers.floodRisk)
	}
	
	$scope.dailyPrecipChange = function() {
		console.log( "dailyPrecipChange" )
		changeLayer( "daily_precipitation", $scope.layers.dailyPrecip)
	}

	$scope.precipForecastChange = function() {
		console.log( "precipForecastChange", $scope.layers.precipForecast.name )
		changeLayer( "daily_precipitation_24h_forecast", $scope.layers.precipForecast)
	}
	
	$scope.floodCatalogChange = function() {
		console.log( "floodCatalogChange", $scope.floodCatalog )
	}
})