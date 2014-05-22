
app.controller('NodesCtrl', function($scope, Nodes) {
  $scope.nodes = Nodes.all();
})