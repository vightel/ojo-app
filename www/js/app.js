// OJO App

var app = angular.module('ojo', ['ionic', 'ojo.controllers', 'ojo.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.nodes', {
      url: '/nodes',
      views: {
        'tab-nodes': {
          templateUrl: 'templates/tab-nodes.html',
          controller: 'NodesCtrl'
        }
      }
    })
	
    .state('tab.node-detail', {
      url: '/node/:nodeId',
      views: {
        'tab-nodes': {
          templateUrl: 'templates/node-detail.html',
          controller: 'NodeDetailCtrl'
        }
      }
    })
	
    .state('tab.report', {
      url: '/report',
      views: {
        'tab-report': {
          templateUrl: 'templates/tab-report.html',
          controller: 'ReportCtrl'
        }
      }
    })
	
    .state('tab.landslide_map', {
      url: '/report/landslide/map',
      views: {
        'tab-report': {
          templateUrl: 'templates/landslide-map.html',
          controller: 'LandslideDetailCtrl'
        }
      }
    })
    .state('tab.landslide_edit', {
      url: '/report/landslide/edit',
      views: {
        'tab-report': {
          templateUrl: 'templates/landslide-edit.html',
          controller: 'LandslideDetailCtrl'
        }
      }
    })
	
    .state('tab.landslide_photo', {
      url: '/report/landslide/photo',
      views: {
        'tab-report': {
          templateUrl: 'templates/landslide-photo.html',
          controller: 'LandslideDetailCtrl'
        }
      }
    })
	
    .state('tab.landslide_reported', {
      url: '/report/landslide/reported',
      views: {
        'tab-report': {
          templateUrl: 'templates/landslide-reported.html',
          controller: 'LandslideDetailCtrl'
        }
      }
    })
	
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })
	
    .state('tab.testing', {
      url: '/testing',
      views: {
        'tab-testing': {
          templateUrl: 'templates/tab-testing.html',
          controller: 'TestCtrl'
        }
      }
    })
	
    .state('persona', {
      url: '^/persona/verify',
	  method: 'post',
      controller: function($stateParams) {
		  console.log("-> /persona/verify", $stateParams)
      }
  	})
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');
  //$urlRouterProvider.otherwise('/tab/account');

});

