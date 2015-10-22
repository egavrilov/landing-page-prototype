function MainFactory($log, $http, $q) {
  let outlets = [];
  let regions = [];
  let defaultRegion = '91eae2f5-b1d7-442f-bc86-c6c11c581fad';
  let factory = {
    base: 'http://api.love.sl/v1/',
    modern: 'http://api.love.sl/v1/',
    outlets: [],
    filterOutlets: filterOutlets
  };

  factory.init = () => {
    return $q.all({
      location: getLocation(),
      regions: getRegions(),
      outlets: getOutlets()
    }).then((response) => {
      factory.region = response.location.data && response.location.data.region_id || defaultRegion;
      outlets = response.outlets.data.filter((outlet) => !outlet.is_franchise);
      regions = outlets
        .reduce((outletsObject, outlet) => {
          if (outlet.region_id && outlet.region_id[0]) {
            outletsObject[outlet.region_id[0]] = true;
          }

          return outletsObject;
        }, {});
      factory.regions = response.regions.data.filter((region) => regions[region.id]);
    }, error).then(filterOutlets);
  };

  function getLocation() {
    return $http.get(factory.base + 'geo/get_location/');
  }

  function getRegions() {
    return $http.get(factory.modern + 'outlets/regions/');
  }

  function getOutlets() {
    return $http.get(factory.modern + 'outlets/');
  }

  function filterOutlets(){
    factory.outlets = outlets.filter((outlet) =>
      outlet.region_id && outlet.region_id.indexOf(factory.region) !== -1);
  }

  function error(response) {
    if (response.status === -1) {
      $log.info('Request timeout, trying again');
      return factory.init();
    }
    if (response.data && response.data.error) {
      $log.warn(response.data.error);
    }
  }

  return factory;
}

export default /*@ngInject*/ MainFactory;
