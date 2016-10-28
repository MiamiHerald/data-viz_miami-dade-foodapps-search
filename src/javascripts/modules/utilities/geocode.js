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
  }

  render() {
    this.initGeolocate()
    this.initGeocode();
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
      $(`#js-deliveries li`).removeClass(`is-active`);
      $(`#resultsHeader`).removeClass(`is-active`);
      this.lookupAddress(this.geocoder);
    });
    document.getElementById(`submit`).addEventListener(`click`, () => {
      $(`#js-deliveries li`).removeClass(`is-active`);
      $(`#resultsHeader`).removeClass(`is-active`);
      this.lookupAddress(this.geocoder);
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

    deliveryDudesData.features.forEach(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        this.results = true;
        $(`#deliveryDudes`).addClass(`is-active`);
      }
    });
    biteSquadData.features.forEach(v => {
      v.geometry.coordinates.forEach(x => {
        if (inside(this.coordinates, x[0])) {
          this.results = true;
          $(`#biteSquad`).addClass(`is-active`);
        }
      });
    });
    grubHubData.features.forEach(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        this.results = true;
        $(`#grubHub`).addClass(`is-active`);
      }
      v.geometry.coordinates.forEach(x => {
        if (inside(this.coordinates, x[0])) {
          this.results = true;
          $(`#grubHub`).addClass(`is-active`);
        }
      });
    });
    postMatesData.features.forEach(v => {
      v.geometry.coordinates.forEach(x => {
        if (inside(this.coordinates, x[0])) {
          this.results = true;
          $(`#postMates`).addClass(`is-active`);
        }
      })
    });
    uberEatsData.features.forEach(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        this.results = true;
        $(`#uberEats`).addClass(`is-active`);
      }
    });
    yelpEat24Data.features.forEach(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        this.results = true;
        $(`#yelpEat24`).addClass(`is-active`);
      }
    });

    if (this.results) {
      $(`#resultsHeader`).html(`Results:`).addClass(`is-active`);
      this.results = false;
    } else {
      $(`#resultsHeader`).html(`No Results`).addClass(`is-active`);
    }
  }
}

const loadGeocode = () => {
  new GeoSearch().render();
}

export { loadGeocode };
