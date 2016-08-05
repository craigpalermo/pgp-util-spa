'use strict';

angular.module('pgpApp.decrypt', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/decrypt', {
      templateUrl: 'decrypt/decrypt.html',
      controller: 'decryptCtrl',
    });
  }])

  .controller('decryptCtrl', [
    '$scope',
    function ($scope) {
      const self = this;

      /**
       * Private functions
       * **********************************
       */

      /**
       * Decrypts the given ciphertext as the recipient privKey. Returns a promise
       * that will return a cleartext message if successful.
       * @param ciphertext
       * @param privKey
       * @returns {*}
       */
      function pgpDecrypt(ciphertext, privKey) {
        const options = {
          message: openpgp.message.readArmored(ciphertext),
          privateKey: openpgp.key.readArmored(privKey).keys[0],
        };

        console.info('Beginning decryption, please wait...');
        return openpgp.decrypt(options).then(function (plaintext) {
          return plaintext.data;
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
      self.decrypt = function decrypt() {
        const {key, input}= self;
        self.isLoading = true;

        pgpDecrypt(input, key).then((output) => {
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
          self.decrypt();
        } else {
          self.output = '';
        }
      }));

      // Configuration variables
      self.conf = {
        page: 'Decrypt',
        input: 'Ciphertext',
        inputPlaceholder: "-----BEGIN PGP MESSAGE-----\n...\n-----END PGP MESSAGE-----",
        keyPlaceholder: "-----BEGIN PGP PRIVATE KEY BLOCK-----\n...\n-----END PGP PRIVATE KEY BLOCK-----",
        keyType: 'Private',
        output: 'Cleartext Message',
      };
    }]);