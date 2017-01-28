import 'angular';

const mainCtrl = angular.module('pgpApp.main', [])

  .controller('mainCtrl', [
    '$scope',
    '$location',
    function ($scope, $location) {
      const self = this;

      /**
       * Returns true if viewLocation matches the current URL path
       * @param viewLocation
       * @returns {boolean}
       */
      $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };

      // Get year to display in footer
      self.today = new Date().getFullYear();
    }]);

mainCtrl.name = 'pgpApp.main';

export default mainCtrl;
