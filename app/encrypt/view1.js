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
    '$rootScope',
    function ($scope, $location, $rootScope) {
      const self = this;

      /**
       * Private functions
       * **********************************
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

      function pgpDecrypt(ciphertext, privKey) {
        const options = {
          message: openpgp.message.readArmored(ciphertext),
          privateKey: openpgp.key.readArmored(privKey).keys[0],
        };

        console.info('Beginning decryption, please wait...');
        return openpgp.decrypt(options).then(function(plaintext) {
          return plaintext.data;
        });
      }

      /**
       * Controller functions
       * **********************************
       */

      self.submit = function submit() {
        const { key, input }= self;
        self.isLoading = true;

        self.conf.process(input, key).then((output) => {
          console.info('Processing successful');

          self.output = output;
          self.isLoading = false;
          $scope.$apply();
        });
      };

      /**
       * Constants
       * **********************************
       */

      ['input', 'key'].map(x => $scope.$watch(`ctrl.${x}`, () => {
        if (angular.isString(self.input) && angular.isString(self.key)) {
          self.submit();
        } else {
          self.output = '';
        }
      }));

      self.modes = {
        '/encrypt': {
          name: 'encrypt',
          titles: {
            page: 'Encrypt',
            input: 'Cleartext Message',
            keyType: 'Public',
            output: 'Ciphertext',
          },
          process: pgpEncrypt,
        },
        '/decrypt': {
          name: 'decrypt',
          titles: {
            page: 'Decrypt',
            input: 'Ciphertext',
            keyType: 'Private',
            output: 'Cleartext Message',
          },
          process: pgpDecrypt,
        },
      };

      self.conf = self.modes[$location.path()];
      $rootScope.mode = self.conf.name;
    }]);