import $ from 'jquery';
import * as d3 from 'd3';
import { TweenLite } from 'gsap';
import inside from 'point-in-polygon';
import * as pym from 'pym.js'

class GeoSearch {
  constructor() {
    this.deliveryDudesUrl = `data/deliverydudes.geo.json`;
    this.biteSquadUrl = `data/bitesquad.geo.json`;
    this.grubHubUrl = `data/grubhub.geo.json`;
    this.postMatesUrl = `data/postmates.geo.json`;
    this.uberEatsUrl = `data/ubereats.geo.json`;
    this.yelpEat24Url = `data/yelpeat24.geo.json`;
    this.coordinates = [];
    this.autocomplete;
    this.results = false;
    this.el = $(`#jsSearchContainer`);
    this.pymChild = null;
  }

  render() {
    this.initGeolocate()
    this.initGeocode();
    $(window).on(`load`, () => {
      this.pymChild = new pym.Child({ renderCallback: this.resizeContainer.bind(this) });
    });
    $(window).on(`resize`, this.resizeContainer.bind(this));
  }

  resizeContainer() {
    window.requestAnimationFrame(() => {
      if (this.pymChild) {
        this.pymChild.sendHeight();
      }
    });
  }

  initGeolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        this.autocomplete.setBounds(circle.getBounds());
      });
    }
    this.initAutocomplete();
  }

  initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete((document.getElementById(`autocomplete`)), {types: [`geocode`]});
  }

  initGeocode() {
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete.addListener('place_changed', () => {
      $(`#js-deliveries li`).removeClass();
      this.lookupAddress(this.geocoder);
      this.resizeContainer();
    });
    document.getElementById(`submit`).addEventListener(`click`, () => {
      $(`#js-deliveries li`).removeClass();
      this.lookupAddress(this.geocoder);
      this.resizeContainer();
    });
  }

  lookupAddress(geocoder) {
    this.address = document.getElementById(`autocomplete`).value;
    geocoder.geocode({'address': this.address}, (results, status) => {
      if (status === 'OK') {
        this.coordinates = [results[0].geometry.location.lng(), results[0].geometry.location.lat()];
        this.loadData();
      } else {
        alert(`Geocode was not successful for the following reason: ${status}`);
      }
    });
  }

  loadData() {
    d3.queue()
        .defer(d3.json, this.deliveryDudesUrl)
        .defer(d3.json, this.biteSquadUrl)
        .defer(d3.json, this.grubHubUrl)
        .defer(d3.json, this.postMatesUrl)
        .defer(d3.json, this.uberEatsUrl)
        .defer(d3.json, this.yelpEat24Url)
        .await(this.renderData.bind(this));
  }

  renderData(error, deliveryDudesData, biteSquadData, grubHubData, postMatesData, uberEatsData, yelpEat24Data) {
    if (error) throw error;

    deliveryDudesData.features.some(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        this.results = true;
        $(`#deliveryDudes`).addClass(`does-deliver`);
      }
    });
    biteSquadData.features.forEach(v => {
      v.geometry.coordinates.forEach(x => {
        if (inside(this.coordinates, x[0])) {
          this.results = true;
          $(`#biteSquad`).addClass(`does-deliver`);
        }
      });
    });
    grubHubData.features.forEach(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        this.results = true;
        $(`#grubHub`).addClass(`does-deliver`);
      }
      v.geometry.coordinates.forEach(x => {
        if (inside(this.coordinates, x[0])) {
          this.results = true;
          $(`#grubHub`).addClass(`does-deliver`);
        }
      });
    });
    postMatesData.features.forEach(v => {
      v.geometry.coordinates.forEach(x => {
        if (inside(this.coordinates, x[0])) {
          this.results = true;
          $(`#postMates`).addClass(`does-deliver`);
        }
      })
    });
    uberEatsData.features.forEach(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        this.results = true;
        $(`#uberEats`).addClass(`does-deliver`);
      }
    });
    yelpEat24Data.features.forEach(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        this.results = true;
        $(`#yelpEat24`).addClass(`does-deliver`);
      }
    });

    $(`li`).not(`.does-deliver`).addClass(`does-not-deliver`);
    if ($('.does-deliver').length) {
      $(`#jsResultsHeader`).html(`${$('.does-deliver').length} of 6 services are available in your area.`);
    } else {
      $(`#jsResultsHeader`).html(`There currently aren't any of these services delivering to your area`);
    }
  }
}

const loadGeocode = () => {
  new GeoSearch().render();
}

export { loadGeocode };
