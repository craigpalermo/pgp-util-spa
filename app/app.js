'use strict';

// Declare app level module which depends on views, and components
angular.module('pgpApp', [
  'ngRoute',
  'pgpApp.mainCtrl',
  'pgpApp.encrypt',
  'pgpApp.about',
  'pgpApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.otherwise({redirectTo: '/encrypt'});
}]);