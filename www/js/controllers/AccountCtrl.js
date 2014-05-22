//
// Account Controller
//
app.controller('AccountCtrl', function($scope, $http) {
	console.log("AccountCtrl")
	
	var stored_user			= window.localStorage['user']
	if( (stored_user != "undefined") && (stored_user != undefined)) {
		try {
		console.log("Found stored_user", JSON.stringify(stored_user))
		$scope.user				= angular.fromJson(stored_user)
		$scope.user_pic_href 	= "http://graph.facebook.com/"+$scope.user.id+"/picture?type=square" 
		} catch(e) { console.log("Excpetion", e)}
	} else {
		console.log("Stored_user not found", stored_user)
	}
	
	if( $scope.user) {
		console.log("Found user from storage", $scope.user.email)
		$scope.email 	= $scope.user.email
		email 			= $scope.user.email
	} else {
		email 			= "pat@cappelaere.com"
	}
		

	$scope.login = function() {
		console.log("Trying to OAuth login...")
		
		var auth0 = new Auth0Client(
		    "ojo.auth0.com",
		    "3pJHifjQGsQLegT3hIKjQce3WF8YAfmV");

		auth0.login(function (err, result) {
		    if (err) return err;
			console.log(JSON.stringify(result.profile))
			window.localStorage['user'] = angular.toJson(result.profile)
  			$scope.user 		= result.profile
  			$scope.picture 		= result.profile.picture
  			$scope.email 		= result.profile.email
		});
	}
	
	// user pushes logout button and triggers this function
	$scope.logout = function() {
		console.log("Facebook logout")
		//Persona.logout();
		$scope.user 				= undefined
		window.localStorage['user'] = undefined
		window.location.reload(false);
	}
})
