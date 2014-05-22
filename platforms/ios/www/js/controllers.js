angular.module('ojo.controllers', [])

.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
