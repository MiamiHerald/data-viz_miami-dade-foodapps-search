import $ from 'jquery';
import * as d3 from 'd3';
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
    this.autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')), {types: ['geocode']});
  }

  initGeocode() {
    this.geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', () => {
      $(`#js-deliveries`).html(``);
      this.lookupAddress(this.geocoder);
    });
  }

  lookupAddress(geocoder) {
    this.address = document.getElementById('autocomplete').value;
    geocoder.geocode({'address': this.address}, (results, status) => {
      if (status === 'OK') {
        this.coordinates = [results[0].geometry.location.lng(), results[0].geometry.location.lat()];
        this.loadData();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
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
        console.log(this.coordinates);
        $(`#js-deliveries`).append(`<li>Delivery Dudes</li>`);
      }
    });
    biteSquadData.features.forEach(v => {
      v.geometry.coordinates.forEach(x => {
        if (inside(this.coordinates, x[0])) {
          console.log(this.coordinates);
          $(`#js-deliveries`).append(`<li>Bite Squad</li>`);
        }
      });
    });
    grubHubData.features.forEach(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        console.log(this.coordinates);
        $(`#js-deliveries`).append(`<li>Post Mates</li>`);
      }
      v.geometry.coordinates.forEach(x => {
        if (inside(this.coordinates, x[0])) {
          console.log(this.coordinates);
          $(`#js-deliveries`).append(`<li>Grub Hub</li>`);
        }
      });
    });
    postMatesData.features.forEach(v => {
      v.geometry.coordinates.forEach(x => {
        if (inside(this.coordinates, x[0])) {
          console.log(this.coordinates);
          $(`#js-deliveries`).append(`<li>Post Mates</li>`);
        }
      })
    });
    uberEatsData.features.forEach(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        console.log(this.coordinates);
        $(`#js-deliveries`).append(`<li>Uber Eats</li>`);
      }
    });
    yelpEat24Data.features.forEach(v => {
      if (inside(this.coordinates, v.geometry.coordinates[0][0])) {
        console.log(this.coordinates);
        $(`#js-deliveries`).append(`<li>Yelp Eat24</li>`);
      }
    });
  }
}

const loadGeocode = () => {
  new GeoSearch().render();
}

export { loadGeocode };