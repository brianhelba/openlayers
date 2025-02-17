import Map from '../src/ol/Map.js';
import View from '../src/ol/View.js';
import MVT from '../src/ol/format/MVT.js';
import VectorTileLayer from '../src/ol/layer/VectorTile.js';
import VectorTileSource from '../src/ol/source/VectorTile.js';
import {Fill, Stroke, Style} from '../src/ol/style.js';

// lookup for selection objects
let selection = {};

const vtLayer = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    maxZoom: 15,
    format: new MVT({
      idProperty: 'iso_a3'
    }),
    url: 'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/' +
      'ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'
  }),
  style: function(feature) {
    const selected = !!selection[feature.getId()];
    return new Style({
      stroke: new Stroke({
        color: selected ? 'rgba(200,20,20,0.8)' : 'gray',
        width: selected ? 2 : 1
      }),
      fill: new Fill({
        color: selected ? 'rgba(200,20,20,0.2)' : 'rgba(20,20,20,0.9)'
      })
    });
  }
});

const map = new Map({
  layers: [
    vtLayer
  ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

const selectElement = document.getElementById('type');

map.on('click', function(event) {
  vtLayer.getFeatures(event.pixel).then(function(features) {
    if (!features.length) {
      selection = {};
      // force redraw of layer style
      vtLayer.setStyle(vtLayer.getStyle());
      return;
    }
    const feature = features[0];
    if (!feature) {
      return;
    }
    const fid = feature.getId();

    if (selectElement.value === 'singleselect') {
      selection = {};
    }
    // add selected feature to lookup
    selection[fid] = feature;

    // force redraw of layer style
    vtLayer.setStyle(vtLayer.getStyle());
  });

});
