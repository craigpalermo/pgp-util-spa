'use strict';

angular.module('pgpApp.version', [
  'pgpApp.version.interpolate-filter',
  'pgpApp.version.version-directive'
])

.value('version', '0.1');
