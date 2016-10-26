import $ from 'jquery';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as pym from 'pym.js'

class GeoSearch {
  constructor() {
    this.deliveryDudesUrl = `data/deliverydudes.geo.json`;
    this.apiKey = `AIzaSyCImegnVwEaB-V1ZjplIVYvTvnKWetTFXo`;
    this.test = [-80.18, 25.79];
  }

  render() {
    this.loadData();
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
      if ((this.test[0] >= d3.geoBounds(v)[0][0] && this.test[0] <= d3.geoBounds(v)[1][0]) && (this.test[1] >= d3.geoBounds(v)[0][1] && this.test[0] <= d3.geoBounds(v)[1][1])) {
        console.log(this.test[0], d3.geoBounds(v)[0][0], d3.geoBounds(v)[1][0]);
        console.log(this.test[1], d3.geoBounds(v)[0][1], d3.geoBounds(v)[1][1]);
      }
    });
  }
}

const loadExample = () => {
  new GeoSearch().render();
}

export { loadExample };
