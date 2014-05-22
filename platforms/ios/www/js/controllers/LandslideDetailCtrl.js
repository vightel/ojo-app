//
// Friend (Landlside/Flood Report) Controller
//
var latlng;

app.controller('LandslideDetailCtrl', function($scope, $stateParams, $location, Friends) {
	
	 // can we get user location
	 var target 	= [18.89, -69.96]
	 var min_zoom	= 6
	 var max_zoom	= 18
	 var zoom		= 10
	 var path		= $location.path()
	 
	 $scope.mapit		= true
	 $scope.editit		= false
	 $scope.pictureit	= false
	 $scope.reported	= false
	 
	 $scope.icon	= "ion-navicon";
	 
	 console.log($location.path())
	 
	 if( ($scope.map == undefined) && (path.indexOf("map")>0) ) {
		 console.log("Init map")
		 $scope.map 	= L.mapbox.map('report_map', config.worldmapid, { 
			 minZoom: 			min_zoom, 
			 maxZoom: 			max_zoom,
			 attributionControl: false,
			 zoomControl: 		false,
			 infoControl: 		false,
			 tileLayer: {
				 detectRetina: true
			 }
		})
		.setView(target, zoom);   
  
		var marker = L.marker(new L.LatLng(18.89, -69.96), {
		    icon: L.mapbox.marker.icon({'marker-color': 'CC0033'}),
			draggable: true
		});

		marker.bindPopup('New Landslide');
		marker.addTo( $scope.map );
		
		marker.on('dragend', function(e){
			latlng = [ e.target.getLatLng().lat, e.target.getLatLng().lng]
		    console.log(latlng);
		});
	}
	
	$scope.photo = function() {
		$location.path("/tab/report/landslide/photo")
	}
	
	$scope.edit = function() {	
		$location.path("/tab/report/landslide/edit")
	}
	$scope.map = function() {	
		$location.path("/tab/report/landslide/map")
	}
	
	$scope.edit_old = function() {
		// go to another page
		console.log("edit it")
		if( $scope.editit === false ) {
			$scope.editit 		= true
	   	 	$scope.mapit		= false
	   	 	$scope.pictureit	= false
			$scope.icon			= "ion-earth"
		} else {
			// go to the map
			$scope.editit 		= false
	   	 	$scope.mapit		= true
	   	 	$scope.pictureit	= false
			$scope.icon			= "ion-navicon"
		}
	}
	
	$scope.createLandslide = function(l) {
		l.latlng = latlng
		console.log("Report", l)
   	 	$scope.mapit			= false
		$scope.editit 			= false
		$scope.reported			= true
	}
	
	$scope.l = {}
	$scope.l.date = moment().format("YYYY-MM-DD")
	$scope.l.time = moment().format("hh:mm:ss")
	
})
