'use strict';

angular.module('pgpApp.encrypt', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/encrypt', {
      templateUrl: 'encrypt/encrypt.html',
      controller: 'encryptCtrl',
      controllerAs: 'ctrl',
    });
  }])

  .controller('encryptCtrl', [
    '$scope',
    function ($scope) {
      const self = this;

      /**
       * Private functions
       * **********************************
       */

      /**
       * Encrypts the given cleartext using pubKey as the recipient. Returns a promise
       * that will return the ciphertext.
       * @param cleartext
       * @param pubKey
       * @returns {Promise}
       */
      function pgpEncrypt(cleartext, pubKey) {
        const options = {
          data: cleartext,
          publicKeys: openpgp.key.readArmored(pubKey).keys,
        };

        return openpgp.encrypt(options).then((ciphertext) => {
          return ciphertext.data;
        });
      }

      /**
       * Controller functions
       * **********************************
       */

      /**
       * Encrypt or decrypt depending on the current mode. Turn off loading flags and
       * set output model once promise resolves. Show error message if operation fails.
       */
      self.encrypt = function encrypt() {
        const {key, input}= self;
        self.isLoading = true;

        pgpEncrypt(input, key).then((output) => {
          console.info('Processing successful');

          self.output = output;
          self.isLoading = false;
          $scope.$apply();
        }).catch((error) => {
          console.error('Unable to decrypt message:', error);
          self.error = error;
          self.isLoading = false;
        });
      };

      /**
       * Constants
       * **********************************
       */

      // Try to encrypt/decrypt when inputs change if both are populated
      ['input', 'key'].map(x => $scope.$watch(`ctrl.${x}`, () => {
        if (angular.isString(self.input) && angular.isString(self.key)) {
          self.encrypt();
        } else {
          self.output = '';
        }
      }));

      // Configuration variables
      self.conf = {
        page: 'Encrypt',
        input: 'Cleartext Message',
        inputPlaceholder: 'They who can give up essential liberty to obtain a little ' +
        'temporary safety deserve neither liberty nor safety.\n\n - Benjamin Franklin',
        keyType: 'Public',
        keyPlaceholder: "-----BEGIN PGP PUBLIC KEY BLOCK-----\n...\n-----END PGP PUBLIC KEY BLOCK-----",
        output: 'Ciphertext',
      };
    }]);