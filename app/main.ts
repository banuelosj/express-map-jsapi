import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Graphic from "esri/Graphic";
import Point from "esri/geometry/Point";
import Sketch from "esri/widgets/Sketch";
import SketchViewModel from "esri/widgets/Sketch/SketchViewModel";

import {
  CustomSketch,
  SketchCreateEvent,
  CurrentSelectedBtn,
} from "./models/CustomSketch";

interface ResultObject {
  graphic: Graphic;
  mapPoint: Point;
}

interface HitTestResult {
  results: ResultObject[];
}

const drawPointButtonNumber = document.getElementById("pointButtonNumber");
const drawPinBtn = document.getElementById("pinBtn");
const drawPolylineBtn = document.getElementById("polylineBtn");
const drawPolygonBtn = document.getElementById("polygonBtn");
const resetBtn = document.getElementById("resetBtn");

const graphicsLayer = new GraphicsLayer();
let numberIndex = 1;
let selectedBtn: HTMLElement | GlobalEventHandlers;

const map = new EsriMap({
  basemap: "gray-vector",
  layers: [graphicsLayer],
});

const mapView = new MapView({
  map: map,
  container: "viewDiv",
  center: [-118, 34],
  zoom: 4,
  highlightOptions: {
    color: "orange",
    haloOpacity: 0.8,
    fillOpacity: 0.2,
  },
});

mapView.when(() => {
  //const cimSymbol = new CimSymbol(1);

  // const sketch = new Sketch({
  //   layer: graphicsLayer,
  //   view: mapView,
  //   container: "topbar",
  //   availableCreateTools: ["rectangle", "circle"],
  // });

  // mapView.ui.add(sketch, "top-right");

  const sketchViewModel = new SketchViewModel({
    view: mapView,
    layer: graphicsLayer,
  });

  const customSketch = new CustomSketch(graphicsLayer);

  sketchViewModel.on("update", function (evt) {
    console.log("updating....");
    resetBtn.style.visibility = "visible";
  });

  sketchViewModel.on("create", function (evt) {
    if (selectedBtn instanceof HTMLElement) {
      customSketch.addGraphic(evt, selectedBtn.id, numberIndex);
      if (selectedBtn.id === CurrentSelectedBtn.CirclePointBtn) {
        console.log("incrementing index...");
        numberIndex++;
      }
    }
  });

  //sketchViewModel.create("point");
  //setActiveButton(drawPointButtonNumber);
  drawPointButtonNumber.onclick = function () {
    // set the sketch to create a point geometry
    selectedBtn = this;
    sketchViewModel.create("point");
    //setActiveButton(this);
    //pointType = "number";
  };

  drawPinBtn.onclick = function () {
    selectedBtn = this;
    sketchViewModel.create("point");
    //setActiveButton(this);
  };

  drawPolylineBtn.onclick = function () {
    selectedBtn = this;
    sketchViewModel.create("polyline");
    //setActiveButton(this);
  };

  drawPolygonBtn.onclick = function () {
    selectedBtn = this;
    sketchViewModel.create("polygon");
    // setActiveButton(this);
  };

  // reset button
  resetBtn.onclick = function () {
    graphicsLayer.removeAll();
    selectedBtn = this;
    //setActiveButton(this);
    numberIndex = 1;
    //cimSymbol.setIndex(1);
  };

  function setActiveButton(selectedButton: any) {
    mapView.focus();
    const elements = document.getElementsByClassName("active");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("active");
    }
    if (selectedButton) {
      selectedButton.classList.add("active");
    }
  }
});

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
