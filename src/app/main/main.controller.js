class MainCtrl{
  /**
   *@ngInject
   */
  constructor($anchorScroll, $http, $scope, $window, Main){
    this.gm = function (googleMapsMethod) {
      let args = [null].concat(Array.prototype.slice.call(arguments, 1));
      return new (Function.prototype.bind.apply($window.google.maps[googleMapsMethod], args));
    };
    this.$anchorScroll = $anchorScroll;
    this.$http = $http;
    this.$window = $window;
    this.$scope = $scope;
    this.model = Main;

    this.limit = 6;
    this.agree = true;
    this.subscribe = true;
    this.isMobile = /android|ip(ad|hone|od)/i.test($window.navigator.userAgent);

    $scope.$on('mapInitialized', () => {
      this.isMapReady = true;
      this.renderMap();
    });
    this.model.init().then(() => {
      this.isDataReady = true;
      this.renderMap();
    });
  }

  renderMap(){
    if (!this.isMapReady || !this.isDataReady) return;
    this.bounds = this.gm('LatLngBounds');
    this.model.outlets.forEach((outlet) => {
      if (outlet.geo && outlet.geo.length){
        let marker = this.addMarker.apply(this, outlet.geo);
        this.bounds.extend(marker.position);
      }
    });
    this.$scope.map.fitBounds(this.bounds);
  }

  renderMarker(geo){
    this.$scope.map.setCenter({lat: geo[0], lng: geo[1]});
    this.$scope.map.setZoom(14);
    this.$anchorScroll('map');
  }

  addMarker(lat, lng){
    if (!this.$scope.map) return;
    return this.gm('Marker', {
      position: this.gm('LatLng', lat, lng),
      map: this.$scope.map
    });
  }

  openMap(){
    if (!this.$scope.map) return;
  }

  trackRegion(){
    this.model.filterOutlets();
    this.renderMap();
  }

  toggleLimit(){
    this.limit = this.limit ? 4 : null;
  }

  register() {
    if(!this.phone || !/9\d{9}/.test(this.phone)) {
      this.invalid = true;
      return;
    }
    this.isLocked = true;
    this.$http.post('http://promo.love.sl/submitjson/1c4d6fdd-af66-42b6-8c03-798d575f0995/', {
      phone: '7' + String(this.phone),
      subscribed: Boolean(this.subscribe).toString()
    }).then(() => {
      this.activated = true;
    }, () => {
      this.invalid = true;
      this.isLocked = false;
    });
  }
}


export default MainCtrl;