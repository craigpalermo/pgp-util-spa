'use strict';

angular.module('pgpApp.encrypt', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/encrypt', {
      templateUrl: 'encrypt/encrypt.html',
      controller: 'encryptCtrl'
    }).when('/decrypt', {
      templateUrl: 'encrypt/encrypt.html',
      controller: 'encryptCtrl'
    });
  }])

  .controller('encryptCtrl', [
    '$scope',
    '$location',
    function ($scope, $location) {
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
      self.process = function process() {
        const { key, input }= self;
        self.isLoading = true;

        self.conf.process(input, key).then((output) => {
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
          self.process();
        } else {
          self.output = '';
        }
      }));

      // Config variables for encrypt/decrypt modes. This is to avoid having two
      // routes with very similar templates/controllers
      self.modes = {
        '/encrypt': {
          page: 'Encrypt',
          input: 'Cleartext Message',
          inputPlaceholder: 'They who can give up essential liberty to obtain a little ' +
            'temporary safety deserve neither liberty nor safety.\n\n - Benjamin Franklin',
          keyType: 'Public',
          keyPlaceholder: "-----BEGIN PGP PUBLIC KEY BLOCK-----\n...\n-----END PGP PUBLIC KEY BLOCK-----",
          output: 'Ciphertext',
          process: pgpEncrypt,
        },
        '/decrypt': {
          page: 'Decrypt',
          input: 'Ciphertext',
          inputPlaceholder: "-----BEGIN PGP MESSAGE-----\n...\n-----END PGP MESSAGE-----",
          keyPlaceholder: "-----BEGIN PGP PRIVATE KEY BLOCK-----\n...\n-----END PGP PRIVATE KEY BLOCK-----",
          keyType: 'Private',
          output: 'Cleartext Message',
          process: pgpDecrypt,
        },
      };

      // Choose which config to use and set active mode on $rootScope
      self.conf = self.modes[$location.path()] || {};
    }]);