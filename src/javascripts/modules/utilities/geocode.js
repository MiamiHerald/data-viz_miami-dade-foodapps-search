import $ from 'jquery';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as pym from 'pym.js'

class GeoSearch {
  constructor() {
    this.deliveryDudesUrl = `data/deliverydudes.geo.json`;
    this.coordinates = [];
  }

  render() {
    this.initGeocode()
  }

  lookupAddress(geocoder) {
    this.address = document.getElementById('address').value;
    geocoder.geocode({'address': this.address}, (results, status) => {
      if (status === 'OK') {
        this.coordinates = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
        this.loadData();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  initGeocode() {
    this.geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', () => {
      this.lookupAddress(this.geocoder);
    });
  }

  loadData() {
    d3.queue()
        .defer(d3.json, this.deliveryDudesUrl)
        .await(this.renderData.bind(this));
  }

  renderData(error, deliveryDudesData) {
    if (error) throw error;

    deliveryDudesData.features.forEach(v => {
      // check if within latitude and longitude
      if ((this.coordinates[0] >= d3.geoBounds(v)[0][0] && this.coordinates[0] <= d3.geoBounds(v)[1][0]) && (this.coordinates[1] >= d3.geoBounds(v)[0][1] && this.coordinates[0] <= d3.geoBounds(v)[1][1])) {
        console.log(this.coordinates[0], d3.geoBounds(v)[0][0], d3.geoBounds(v)[1][0]);
        console.log(this.coordinates[1], d3.geoBounds(v)[0][1], d3.geoBounds(v)[1][1]);
      }
    });
  }
}

const loadGeocode = () => {
  new GeoSearch().render();
}

export { loadGeocode};
