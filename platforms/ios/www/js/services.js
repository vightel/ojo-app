angular.module('ojo.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  var friends = [
    { id: 0, name: 'Landslide' },
    { id: 1, name: 'Flood' },
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('Nodes', function() {
 
  var nodes = config.regions;

  return {
    all: function() {
      return nodes;
    },
    get: function(nodeId) {
      // Simple index lookup
      return nodes[nodeId];
    }
  }
});
