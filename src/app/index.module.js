import MainFactory from './main/main.factory';
import MainController from './main/main.controller';
import Outlets from './components/slOutlets/slOutlets.directive';

angular.module('slLandingPresent', ['ngMap', 'angular.vertilize'])
  .factory('Main', MainFactory)
  .directive('slOutlets', () => new Outlets())
  .controller('MainController', MainController);
