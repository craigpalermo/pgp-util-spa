'use strict';

angular.module('pgpApp.about', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/about', {
      templateUrl: 'about/about.html',
      controller: 'aboutCtrl',
    });
  }])

  .controller('aboutCtrl', [
    '$rootScope',
    function () {
    }]);
