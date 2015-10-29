class MainCtrl{
  /**
   *@ngInject
   */
  constructor($anchorScroll, $http, $scope, $window, Main){
    this.$anchorScroll = $anchorScroll;
    this.$http = $http;
    this.$window = $window;
    this.$scope = $scope;
    this.model = Main;

    this.limit = 6;
    this.agree = true;
    this.subscribe = true;
    this.isMobile = /android|ip(ad|hone|od)/i.test($window.navigator.userAgent);
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
    this.$scope.map.panToBounds(this.bounds);
  }

  renderMarker(geo){
    this.$scope.map.setCenter({lat: geo[0], lng: geo[1]});
    this.$scope.map.setZoom(14);
    this.$anchorScroll('map');
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
    this.$http.post('http://promo.love.sl/submitjson/71bf9d85-cee4-11e4-b269-001018f04542/', {
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
