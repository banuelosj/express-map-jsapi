import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Graphic from "esri/Graphic";
import Point from "esri/geometry/Point";
import TestGraphicsLayer from "./TestGraphicsLayer";

interface ResultObject {
  graphic: Graphic;
  mapPoint: Point;
}

interface HitTestResult {
  results: ResultObject[];
}

const map = new EsriMap({
  basemap: "gray-vector",
});

const mapView = new MapView({
  map: map,
  container: "viewDiv",
  center: [-118, 34],
  zoom: 4,
  highlightOptions: {
    color: "blue",
  },
});

const graphicsLayer = TestGraphicsLayer;

// loading client side graphics from a graphics layer
// feature layer also works here (clientLayer: GraphicsLayer || FeatureLayer)
const loadClientLayer = (view: MapView, clientLayer: GraphicsLayer): void => {
  view
    .when()
    .then(() => {
      return clientLayer.when();
    })
    .then((layer) => {
      return view.whenLayerView(layer);
    })
    .then((layerView) => {
      view.on("pointer-move", eventHandler);
      view.on("pointer-down", eventHandler);

      function eventHandler(event: MouseEvent): void {
        // using the hitTest() of the MapView to identify graphics on the screen
        view.hitTest(event).then(getGraphics);
      }

      //let highlight = layerView.highlight();
      let highlight: __esri.Handle = null;

      function getGraphics(response: HitTestResult): void {
        if (highlight) {
          highlight.remove();
          highlight = null;
          //return;
        }

        // obtaining the topmost graphic
        if (response.results.length) {
          const graphic = response.results.filter((result) => {
            return result.graphic.layer === clientLayer;
          })[0].graphic;

          highlight = layerView.highlight(graphic);
        }
      }
    });
};

loadClientLayer(mapView, graphicsLayer);
