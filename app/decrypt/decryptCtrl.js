'use strict';

angular.module('pgpApp.decrypt', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/decrypt', {
      templateUrl: 'encrypt/encrypt.html',
      controller: 'decryptCtrl',
      controllerAs: 'ctrl',
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
       * @param privKeyStr
       * @param privKeyPassphrase
       * @returns {*}
       */
      function pgpDecrypt(ciphertext, privKeyStr, privKeyPassphrase) {
        // Create private key object using given private key string
        let privateKey = openpgp.key.readArmored(privKeyStr).keys[0];

        // Decrypt private key if passphrase is given
        if (!!privKeyPassphrase) {
          privateKey.decrypt(privKeyPassphrase);
        }

        const options = {
          message: openpgp.message.readArmored(ciphertext),
          privateKey: privateKey,
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
        const { key, input, passphrase }= self;
        self.isLoading = true;

        pgpDecrypt(input, key, passphrase).then((output) => {
          self.output = output;
          self.isLoading = false;
          self.error = null;
          $scope.$apply();

          console.info('Processing successful');
        }).catch((error) => {
          self.error = "Error decrypting message. Does your private key have a passphrase?";
          self.isLoading = false;
          $scope.$apply();

          console.error('Unable to decrypt message:', error);
        });
      };

      /**
       * Constants
       * **********************************
       */

      // Try to encrypt/decrypt when inputs change if both are populated
      ['input', 'key', 'passphrase'].map(x => $scope.$watch(`ctrl.${x}`, () => {
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
        inputTooltip: 'Enter the message to decrypt here',
        inputPlaceholder: "-----BEGIN PGP MESSAGE-----\n...\n-----END PGP MESSAGE-----",
        keyPlaceholder: "-----BEGIN PGP PRIVATE KEY BLOCK-----\n...\n-----END PGP PRIVATE KEY BLOCK-----",
        keyType: 'Private',
        keyTooltip: "Enter the recipient's private key here",
        output: 'Cleartext Message',
        decrypt: true,
        keyInputRows: 5,
      };
    }]);