import 'angular';

const MODULE_NAME = 'pgpApp.about';

const aboutCtrl = angular.module(MODULE_NAME, [])

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

aboutCtrl.name = MODULE_NAME;

export default aboutCtrl;