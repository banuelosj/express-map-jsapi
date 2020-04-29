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
import { CIMSymbol } from "esri/symbols";

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
const deleteBtn = document.getElementById("deleteBtn");
const drawArrowBtn = document.getElementById("arrowBtn");
// HTMLInputElement allows us to use the disabled property
const undoBtn = <HTMLInputElement>document.getElementById("undoBtn");
undoBtn.disabled = true;
const redoBtn = <HTMLInputElement>document.getElementById("redoBtn");
redoBtn.disabled = true;

const graphicsLayer = new GraphicsLayer();
let numberIndex = 1;
let selectedBtn: HTMLElement | GlobalEventHandlers;
let selectedGraphic: Graphic = null;
let isGraphicClick = false;
let isArrowDrawEnabled = false;

let sketchViewModel: SketchViewModel = null;
let customSketch: CustomSketch = null;

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
  // const sketch = new Sketch({
  //   layer: graphicsLayer,
  //   view: mapView,
  //   container: "topbar",
  //   availableCreateTools: ["rectangle", "circle"],
  // });

  // mapView.ui.add(sketch, "top-right");

  sketchViewModel = new SketchViewModel({
    view: mapView,
    layer: graphicsLayer,
  });

  customSketch = new CustomSketch(graphicsLayer);

  sketchViewModel.on("update", function (evt) {
    //console.log("updating....");
    // console.log("event: ", evt);
    // selectedGraphics = evt.graphics;
  });

  sketchViewModel.watch("state", function (state) {
    if (state === "active") {
      undoBtn.disabled = false;
    }
  });

  sketchViewModel.on("undo", function (event) {
    // enable the redo button
    redoBtn.disabled = false;
  });

  sketchViewModel.on("create", function (evt) {
    if (selectedBtn instanceof HTMLElement) {
      customSketch.addGraphic(evt, selectedBtn.id, numberIndex);
      if (selectedBtn.id === CurrentSelectedBtn.CirclePointBtn) {
        numberIndex++;

        // setting the circle text button to the next number
        // helps user know what the next number is without having
        // to look for the largest number
        drawPointButtonNumber.innerHTML = numberIndex.toString();
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
    //setActiveButton(this);
  };

  drawArrowBtn.onclick = function () {
    selectedBtn = this;
    isArrowDrawEnabled = true;
  };

  // reset button
  deleteBtn.onclick = function () {
    // just want to remove the currently selected graphics
    if (selectedGraphic !== null) {
      // TODO: this code works if the ability to delete multiple
      // graphics is added
      graphicsLayer.removeMany([selectedGraphic]);
      mapView.graphics.removeAll();
    }
    deleteBtn.style.visibility = "hidden";
    if (selectedGraphic.symbol.type === "cim") {
      numberIndex = getCimNumber(selectedGraphic);
    }

    //selectedBtn = this;
    //setActiveButton(this);
    //numberIndex = numbersIndex - 1;
    //cimSymbol.setIndex(1);
  };

  // TODO: work on removing the any type here to use CIMSymbol
  function getCimNumber(graphic: any): number {
    return parseInt(
      graphic.symbol.data.symbolLayers[0].markerGraphics[0].symbol.textString
    );
  }

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

undoBtn.onclick = function () {
  if (sketchViewModel.state !== "active") {
    undoBtn.disabled = true;
  } else {
    sketchViewModel.undo();
  }
};

redoBtn.onclick = function () {
  sketchViewModel.redo();
};

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
      // view.on("drag", function (e) {
      //   console.log(e);
      //   // e.stopPropagation();
      // });
      view.on("drag", function (e: any) {
        if (isArrowDrawEnabled) {
          dragEventHandler(e, view);
        }
      });

      function eventHandler(event: MouseEvent): void {
        // using the hitTest() of the MapView to identify graphics on the screen
        isGraphicClick = event.type === "pointer-down" ? true : false;
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

          // display the trash can to delete the currently selected graphic
          if (isGraphicClick) {
            deleteBtn.style.visibility = "visible";
            selectedGraphic = graphic;
          }
        }
      }
    });
};

function dragEventHandler(e: any, view: MapView) {
  e.stopPropagation();
  if (e.origin.x !== e.x && e.origin.y !== e.y) {
    const arrow = customSketch.drawArrow(e.origin, { x: e.x, y: e.y }, view);
    view.graphics.removeAll();
    view.graphics.addMany(arrow);
    if (e.action === "end") {
      graphicsLayer.addMany(arrow);
      isArrowDrawEnabled = false;
    }
  }
}

loadClientLayer(mapView, graphicsLayer);
