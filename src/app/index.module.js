
import MainFactory from './main/main.factory';
import MainController from './main/main.controller';

angular.module('slLandingPresent', ['ngMap', 'angular.vertilize'])
  .factory('Main', MainFactory)
  .controller('MainController', MainController);
