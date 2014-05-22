app.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})