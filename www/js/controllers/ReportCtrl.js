app.controller('ReportCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})