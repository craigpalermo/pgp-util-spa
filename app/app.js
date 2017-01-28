// Angular
import 'angular';
import 'angular-route';

// 3rd party
import 'angular-ui-bootstrap';

// Routes
import mainCtrl from './mainCtrl';
import encryptCtrl from './encrypt/encryptCtrl';
import decryptCtrl from './decrypt/decryptCtrl';
import aboutCtrl from './about/aboutCtrl';

angular.module('pgpApp', [
  'ngRoute',
  'ui.bootstrap',
  mainCtrl.name,
  encryptCtrl.name,
  decryptCtrl.name,
  aboutCtrl.name,
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
  $routeProvider.otherwise({redirectTo: '/encrypt'});
}]);
