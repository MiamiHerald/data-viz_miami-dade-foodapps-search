import $ from 'jquery';
import * as d3 from 'd3';
import * as topojson from 'topojson';
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
  }

  render() {
    this.initGeocode()
  }

  lookupAddress(geocoder) {
    this.address = document.getElementById('address').value;
    geocoder.geocode({'address': this.address}, (results, status) => {
      if (status === 'OK') {
        this.coordinates = [results[0].geometry.location.lng(), results[0].geometry.location.lat()];
        this.loadData();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  initGeocode() {
    this.geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', () => {
      $(`#js-deliveries`).html(``);
      this.lookupAddress(this.geocoder);
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
      // check if within latitude and longitude
      if ((this.coordinates[0] >= d3.geoBounds(v)[0][0] && this.coordinates[0] <= d3.geoBounds(v)[1][0]) && (this.coordinates[1] >= d3.geoBounds(v)[0][1] && this.coordinates[0] <= d3.geoBounds(v)[1][1])) {
        console.log(this.coordinates, d3.geoBounds(v));
        $(`#js-deliveries`).append(`<li>Delivery Dudes</li>`);
      }
    });
    biteSquadData.features.forEach(v => {
      // check if within latitude and longitude
      if ((this.coordinates[0] >= d3.geoBounds(v)[0][0] && this.coordinates[0] <= d3.geoBounds(v)[1][0]) && (this.coordinates[1] >= d3.geoBounds(v)[0][1] && this.coordinates[0] <= d3.geoBounds(v)[1][1])) {
        console.log(this.coordinates, d3.geoBounds(v));
        $(`#js-deliveries`).append(`<li>Bite Squad</li>`);
      }
    });
    grubHubData.features.forEach(v => {
      // check if within latitude and longitude
      if ((this.coordinates[0] >= d3.geoBounds(v)[0][0] && this.coordinates[0] <= d3.geoBounds(v)[1][0]) && (this.coordinates[1] >= d3.geoBounds(v)[0][1] && this.coordinates[0] <= d3.geoBounds(v)[1][1])) {
        console.log(this.coordinates, d3.geoBounds(v));
        $(`#js-deliveries`).append(`<li>Grub Hub</li>`);
      }
    });
    postMatesData.features.forEach(v => {
      // check if within latitude and longitude
      if ((this.coordinates[0] >= d3.geoBounds(v)[0][0] && this.coordinates[0] <= d3.geoBounds(v)[1][0]) && (this.coordinates[1] >= d3.geoBounds(v)[0][1] && this.coordinates[0] <= d3.geoBounds(v)[1][1])) {
        console.log(this.coordinates, d3.geoBounds(v));
        $(`#js-deliveries`).append(`<li>Post Mates</li>`);
      }
    });
    uberEatsData.features.forEach(v => {
      // check if within latitude and longitude
      if ((this.coordinates[0] >= d3.geoBounds(v)[0][0] && this.coordinates[0] <= d3.geoBounds(v)[1][0]) && (this.coordinates[1] >= d3.geoBounds(v)[0][1] && this.coordinates[0] <= d3.geoBounds(v)[1][1])) {
        console.log(this.coordinates, d3.geoBounds(v));
        $(`#js-deliveries`).append(`<li>Uber Eats</li>`);
      }
    });
    yelpEat24Data.features.forEach(v => {
      // check if within latitude and longitude
      if ((this.coordinates[0] >= d3.geoBounds(v)[0][0] && this.coordinates[0] <= d3.geoBounds(v)[1][0]) && (this.coordinates[1] >= d3.geoBounds(v)[0][1] && this.coordinates[0] <= d3.geoBounds(v)[1][1])) {
        console.log(this.coordinates, d3.geoBounds(v));
        $(`#js-deliveries`).append(`<li>Yelp Eat24</li>`);
      }
    });
  }
}

const loadGeocode = () => {
  new GeoSearch().render();
}

export { loadGeocode};
