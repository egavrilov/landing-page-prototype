class Outlets {
  constructor() {
    this.restrict = 'A';
    this.scope = true;
    this.bindToController = true;
    this.templateUrl = 'app/components/slOutlets/slOutlets.html';
    this.controller = OutletsController;
    this.controllerAs = 'outlets';
  }
}

class OutletsController {
  /**
   *@ngInject
   */
  constructor($document, $scope, $timeout, $window, Main) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$document = $document;
    this.$window = $window;
    this.model = Main;

    $scope.$on('mapInitialized', () => {
      this.isMapInit = true;
      this.isModelInit && this.render();
    });

    this.model.init().then(() => {
      this.isModelInit = true;
      this.isMapInit && this.render();
    });
  }

  render() {
    this.bounds = this.gm('LatLngBounds');
    this.model.outlets.forEach((outlet) => {
      if (outlet.geo && outlet.geo.length) {
        let marker = this.gm('LatLng', outlet.geo[0], outlet.geo[1]);
        this.bounds.extend(marker);
      }
    });
    console.log(this.$scope.map);
    this.$scope.google.maps.event.trigger(this.$scope.map, 'resize');
    this.$scope.map.fitBounds(this.bounds);
    this.$scope.map.panToBounds(this.bounds);
  }

  showcase(refresh){
    if (refresh) {
      console.log(this.$scope);
      this._showcase = refresh;
      this.$timeout(() => {
        this.render();
      });
    }

    return this._showcase || 'list';
  }

  trackRegion() {
    this.model.filterOutlets();
    this.render();
  }

  addMarker(lat, lng) {
    if (!this.$scope.map) return;
    return this.gm('Marker', {
      position: this.gm('LatLng', lat, lng),
      map: this.$scope.map
    });
  }

  openInfo(event, outlet, outletsScope) {
    let id = outlet.id;
    let map = this.map || this.$scope.map;
    let infoWindow = map.infoWindows[`info_${id}`];
    let marker = map.markers[`outlet_${id}`];
    let anchor = marker ? marker : (this.getPosition ? this : null);
    let scope = outletsScope.$scope;

    scope.current = outlet;
    scope.getKeys = (some) => Object.keys(some).join('\n');
    outlet.icon = '/assets/marker_active.png';
    infoWindow.__open(map, scope, anchor);

    if (event !== null) {
      outletsScope.select(outlet);
      outletsScope.$timeout(() => outletsScope.scroll());
    }

    if (map.singleInfoWindow) {
      if (map.lastInfoWindow && map.lastInfoWindow !== id) {
        map.infoWindows[`info_${map.lastInfoWindow}`].close();
        outletsScope.model.getById(map.lastInfoWindow).icon = '';
      }
      map.lastInfoWindow = id;
    }
  }

  select(selectedOutlet) {
    this.model.outlets.forEach((outlet) => {
      outlet.selected = (outlet.id === selectedOutlet.id);
    });

    this.openInfo(null, selectedOutlet, this);
  }

  scroll() {
    let list = document.querySelector('.outlets--wrapper');
    let selected = list.querySelector('.outlet-selected');
    angular.element(list).animate({
      scrollTop: selected.offsetTop - selected.offsetHeight
    });
    angular.element(document).scrollTop(window.pageYOffset + list.parentNode.getBoundingClientRect().top)
  }

  filter(outlet) {
    let belongsToMap;
    let matchPattern = true;
    if (!this)  return;

    if (this.$scope.map) {
      let bounds = this.$scope.map.getBounds();
      belongsToMap = bounds.contains(this.$scope.map.markers[`outlet_${outlet.id}`].getPosition());
    }

    if (this.outletsFilter)
      matchPattern = angular.toJson(outlet).toLowerCase().indexOf(this.outletsFilter) !== 1;

    return belongsToMap && matchPattern;
  }

  zoomChanged() {
    this.scope.$apply();
  }

  gm(googleMapsMethod) {
    let args = [null].concat(Array.prototype.slice.call(arguments, 1));
    return new (Function.prototype.bind.apply(this.$window.google.maps[googleMapsMethod], args));
  }
}

export default Outlets;
