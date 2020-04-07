import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Graphic from "esri/Graphic";
import Point from "esri/geometry/Point";
import TestGraphicsLayer from "./TestGraphicsLayer";
import { CimSymbol } from "./CimSymbol";
import Sketch from "esri/widgets/Sketch";
import SketchViewModel from "esri/widgets/Sketch/SketchViewModel";
import { CIMSymbol } from "esri/symbols";
import { Geometry } from "esri/geometry";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";

interface ResultObject {
  graphic: Graphic;
  mapPoint: Point;
}

interface HitTestResult {
  results: ResultObject[];
}

interface SketchCreateEvent {
  graphic: Graphic;
  state: String;
  tool: String;
  toolEventInfo: {};
  type: "create";
}

enum CurrentSelectedBtn {
  CircleBtn = "pointButtonNumber",
  PinBtn = "pinBtn",
  TrashBtn = "resetBtn",
}

const drawPointButtonNumber = document.getElementById("pointButtonNumber");
const drawPinBtn = document.getElementById("pinBtn");
const resetBtn = document.getElementById("resetBtn");

const cimLayer = new GraphicsLayer();
const graphicsLayer = new GraphicsLayer();
let numberIndex = 1;
let selectedBtn: any = null;

const map = new EsriMap({
  basemap: "gray-vector",
  layers: [cimLayer, graphicsLayer],
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

  const sketch = new Sketch({
    layer: graphicsLayer,
    view: mapView,
    container: "topbar",
  });

  mapView.ui.add(sketch, "top-right");

  const sketchViewModel = new SketchViewModel({
    view: mapView,
    layer: cimLayer,
  });

  sketchViewModel.on("create", addGraphic);

  function addGraphic(event: SketchCreateEvent) {
    if (event.state === "complete") {
      if (selectedBtn.id === CurrentSelectedBtn.PinBtn) {
        cimLayer.remove(event.graphic);
        addPinBtn(sketchViewModel, event.graphic);
      } else {
        // add the CIM Symbol
        cimLayer.remove(event.graphic);

        const cimSymbol = new CIMSymbol({
          data: getPointSymbolData(),
        });

        const newGraphic = new Graphic({
          geometry: event.graphic.geometry,
          symbol: cimSymbol,
        });
        cimLayer.add(newGraphic);

        sketchViewModel.create("point");
      }
    }
  }

  //sketchViewModel.create("point");
  //setActiveButton(drawPointButtonNumber);
  drawPointButtonNumber.onclick = function () {
    // set the sketch to create a point geometry
    selectedBtn = this;
    sketchViewModel.create("point");
    setActiveButton(this);
    //pointType = "number";
  };

  drawPinBtn.onclick = function () {
    selectedBtn = this;
    sketchViewModel.create("point");
    setActiveButton(this);
  };

  // reset button
  resetBtn.onclick = function () {
    cimLayer.removeAll();
    selectedBtn = this;
    setActiveButton(this);
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

function addPinBtn(model: SketchViewModel, graphic: Graphic): void {
  const pinSymbol = new SimpleMarkerSymbol({
    color: "#0079C1",
    size: "20px",
    path:
      "M15.999 0C11.214 0 8 1.805 8 6.5v17l7.999 8.5L24 23.5v-17C24 1.805 20.786 0 15.999 0zM16 14.402A4.4 4.4 0 0 1 11.601 10a4.4 4.4 0 1 1 8.798 0A4.4 4.4 0 0 1 16 14.402z",
  });

  const pinGraphic = new Graphic({
    geometry: graphic.geometry,
    symbol: pinSymbol,
  });
  cimLayer.add(pinGraphic);

  model.create("point");
}

function getPointSymbolData() {
  return {
    type: "CIMPointSymbol",
    symbolLayers: [
      {
        type: "CIMVectorMarker",
        enable: true,
        size: 20,
        colorLocked: true,
        anchorPointUnits: "Relative",
        frame: { xmin: -5, ymin: -5, xmax: 5, ymax: 5 },
        markerGraphics: [
          {
            type: "CIMMarkerGraphic",
            geometry: { x: 0, y: 0 },
            symbol: {
              type: "CIMTextSymbol",
              fontFamilyName: "Arial",
              fontStyleName: "Bold",
              height: 4,
              horizontalAlignment: "Center",
              offsetX: 0,
              offsetY: 5,
              symbol: {
                type: "CIMPolygonSymbol",
                symbolLayers: [
                  {
                    type: "CIMSolidFill",
                    enable: true,
                    color: [255, 255, 255, 255],
                  },
                ],
              },
              verticalAlignment: "Center",
            },
            textString: String(numberIndex++),
          },
        ],
        scaleSymbolsProportionally: true,
        respectFrame: true,
      },
      {
        type: "CIMVectorMarker",
        enable: true,
        anchorPoint: { x: 0, y: -0.5 },
        anchorPointUnits: "Relative",
        size: 20,
        frame: { xmin: 0.0, ymin: 0.0, xmax: 17.0, ymax: 17.0 },
        markerGraphics: [
          {
            type: "CIMMarkerGraphic",
            geometry: {
              rings: [
                [
                  [8.5, 0.2],
                  [7.06, 0.33],
                  [5.66, 0.7],
                  [4.35, 1.31],
                  [3.16, 2.14],
                  [2.14, 3.16],
                  [1.31, 4.35],
                  [0.7, 5.66],
                  [0.33, 7.06],
                  [0.2, 8.5],
                  [0.33, 9.94],
                  [0.7, 11.34],
                  [1.31, 12.65],
                  [2.14, 13.84],
                  [3.16, 14.86],
                  [4.35, 15.69],
                  [5.66, 16.3],
                  [7.06, 16.67],
                  [8.5, 16.8],
                  [9.94, 16.67],
                  [11.34, 16.3],
                  [12.65, 15.69],
                  [13.84, 14.86],
                  [14.86, 13.84],
                  [15.69, 12.65],
                  [16.3, 11.34],
                  [16.67, 9.94],
                  [16.8, 8.5],
                  [16.67, 7.06],
                  [16.3, 5.66],
                  [15.69, 4.35],
                  [14.86, 3.16],
                  [13.84, 2.14],
                  [12.65, 1.31],
                  [11.34, 0.7],
                  [9.94, 0.33],
                  [8.5, 0.2],
                ],
              ],
            },
            symbol: {
              type: "CIMPolygonSymbol",
              symbolLayers: [
                {
                  type: "CIMSolidFill",
                  enable: true,
                  color: [39, 129, 153, 255],
                },
              ],
            },
          },
        ],
        scaleSymbolsProportionally: true,
        respectFrame: true,
      },
    ],
  };
}

// code below is used for the hitTest with a graphics layer
//const graphicsLayer = TestGraphicsLayer;

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

loadClientLayer(mapView, cimLayer);
