'use strict';

// Declare app level module which depends on views, and components
angular.module('pgpApp', [
  'ngRoute',
  'pgpApp.encrypt',
  'pgpApp.decrypt',
  'pgpApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/encrypt'});
}]);
