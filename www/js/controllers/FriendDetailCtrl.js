//
// Friend (Landlside/Flood Report) Controller
//

app.controller('FriendDetailCtrl', function($scope, $stateParams, $location, Friends) {
	$scope.friend = Friends.get($stateParams.friendId);
	
	 // can we get user location
	 var target 	= [18.89, -69.96]
	 var min_zoom	= 6
	 var max_zoom	= 18
	 var zoom		= 10
	 var latlng
	 
	 $scope.mapit		= true
	 $scope.editit		= false
	 $scope.pictureit	= false
	 $scope.reported	= false
	 
	 $scope.icon	= "ion-navicon";
	 
	 if( $scope.map == undefined ) {
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
		    console.log(e.target.getLatLng());
			latlng = e.target.getLatLng()
		});
	}
	
	$scope.showMap = function() {
		//console.log("Refresh Map")
		//$scope.map.invalidateSize()
	}
	
	$scope.takePicture = function() {
		if( $scope.pictureit === false ) {
	   	 	$scope.pictureit	= true
	   	 	$scope.mapit		= false
	   	 	$scope.editit		= false
			console.log("Take picture")
		} else {
	   	 	$scope.pictureit	= false
	   	 	$scope.mapit		= true
	   	 	$scope.editit		= false
			$scope.icon			= "ion-navicon"
		}
		$scope.showMap()
	}
	
	$scope.edit = function() {
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
		$scope.showMap()
	}
	
	$scope.createLandslide = function(l) {
		//l.latlng = latlng
		console.log("Report", l)
   	 	$scope.mapit			= false
		$scope.editit 			= false
		$scope.reported			= true
	}
	
	$scope.l = {}
	$scope.l.date = moment().format("YYYY-MM-DD")
	$scope.l.time = moment().format("hh:mm:ss")
	
	$scope.showMap()
})
