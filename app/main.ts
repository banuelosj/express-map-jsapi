import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import Graphic from "esri/Graphic";
import Point from "esri/geometry/Point";

interface ResultObject {
  graphic: Graphic;
  mapPoint: Point;
}

interface HitTestResult {
  results: ResultObject[];
}

const map = new EsriMap({
  basemap: "streets"
});

const mapView = new MapView({
  map: map,
  container: "viewDiv",
  center: [-118, 34],
  zoom: 4,
  highlightOptions: {
    color: "orange"
  }
});

const citiesLayer = new FeatureLayer({
  url:
    "https://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0"
});

map.add(citiesLayer);

// loading client side graphics from a featureLayer
const loadClientLayer = (view: MapView, featureLayer: FeatureLayer): void => {
  view
    .when()
    .then(() => {
      return featureLayer.when();
    })
    .then(layer => {
      return view.whenLayerView(layer);
    })
    .then(layerView => {
      view.on("pointer-move", eventHandler);
      view.on("pointer-down", eventHandler);

      function eventHandler(event: MouseEvent): void {
        view.hitTest(event).then(getGraphics);
      }

      //let highlight = layerView.highlight();
      let highlight: __esri.Handle = null;

      function getGraphics(response: HitTestResult): void {
        // obtaining the topmost graphic
        if (response.results.length) {
          const graphic = response.results.filter(result => {
            return result.graphic.layer === featureLayer;
          })[0].graphic;

          if (highlight) {
            highlight.remove();
            highlight = null;
            return;
          }

          highlight = layerView.highlight(graphic);
        }
      }
    });
};

loadClientLayer(mapView, citiesLayer);
