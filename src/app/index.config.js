function config ($httpProvider) {
  $httpProvider.defaults.timeout = 1000;
}

export default /*@ngInject*/ config;
