var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/Sketch", "esri/widgets/Sketch/SketchViewModel", "esri/symbols", "esri/symbols/SimpleMarkerSymbol"], function (require, exports, Map_1, MapView_1, GraphicsLayer_1, Graphic_1, Sketch_1, SketchViewModel_1, symbols_1, SimpleMarkerSymbol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    MapView_1 = __importDefault(MapView_1);
    GraphicsLayer_1 = __importDefault(GraphicsLayer_1);
    Graphic_1 = __importDefault(Graphic_1);
    Sketch_1 = __importDefault(Sketch_1);
    SketchViewModel_1 = __importDefault(SketchViewModel_1);
    SimpleMarkerSymbol_1 = __importDefault(SimpleMarkerSymbol_1);
    var CurrentSelectedBtn;
    (function (CurrentSelectedBtn) {
        CurrentSelectedBtn["CircleBtn"] = "pointButtonNumber";
        CurrentSelectedBtn["PinBtn"] = "pinBtn";
        CurrentSelectedBtn["TrashBtn"] = "resetBtn";
    })(CurrentSelectedBtn || (CurrentSelectedBtn = {}));
    var drawPointButtonNumber = document.getElementById("pointButtonNumber");
    var drawPinBtn = document.getElementById("pinBtn");
    var resetBtn = document.getElementById("resetBtn");
    var cimLayer = new GraphicsLayer_1.default();
    var graphicsLayer = new GraphicsLayer_1.default();
    var numberIndex = 1;
    var selectedBtn = null;
    var map = new Map_1.default({
        basemap: "gray-vector",
        layers: [cimLayer, graphicsLayer],
    });
    var mapView = new MapView_1.default({
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
    mapView.when(function () {
        //const cimSymbol = new CimSymbol(1);
        var sketch = new Sketch_1.default({
            layer: graphicsLayer,
            view: mapView,
            container: "topbar",
        });
        mapView.ui.add(sketch, "top-right");
        var sketchViewModel = new SketchViewModel_1.default({
            view: mapView,
            layer: cimLayer,
        });
        sketchViewModel.on("create", addGraphic);
        function addGraphic(event) {
            if (event.state === "complete") {
                if (selectedBtn.id === CurrentSelectedBtn.PinBtn) {
                    cimLayer.remove(event.graphic);
                    addPinBtn(sketchViewModel, event.graphic);
                }
                else {
                    // add the CIM Symbol
                    cimLayer.remove(event.graphic);
                    var cimSymbol = new symbols_1.CIMSymbol({
                        data: getPointSymbolData(),
                    });
                    var newGraphic = new Graphic_1.default({
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
        function setActiveButton(selectedButton) {
            mapView.focus();
            var elements = document.getElementsByClassName("active");
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove("active");
            }
            if (selectedButton) {
                selectedButton.classList.add("active");
            }
        }
    });
    function addPinBtn(model, graphic) {
        var pinSymbol = new SimpleMarkerSymbol_1.default({
            color: "#0079C1",
            size: "20px",
            path: "M15.999 0C11.214 0 8 1.805 8 6.5v17l7.999 8.5L24 23.5v-17C24 1.805 20.786 0 15.999 0zM16 14.402A4.4 4.4 0 0 1 11.601 10a4.4 4.4 0 1 1 8.798 0A4.4 4.4 0 0 1 16 14.402z",
        });
        var pinGraphic = new Graphic_1.default({
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
    var loadClientLayer = function (view, clientLayer) {
        view
            .when()
            .then(function () {
            return clientLayer.when();
        })
            .then(function (layer) {
            return view.whenLayerView(layer);
        })
            .then(function (layerView) {
            view.on("pointer-move", eventHandler);
            view.on("pointer-down", eventHandler);
            function eventHandler(event) {
                // using the hitTest() of the MapView to identify graphics on the screen
                view.hitTest(event).then(getGraphics);
            }
            //let highlight = layerView.highlight();
            var highlight = null;
            function getGraphics(response) {
                if (highlight) {
                    highlight.remove();
                    highlight = null;
                    //return;
                }
                // obtaining the topmost graphic
                if (response.results.length) {
                    var graphic = response.results.filter(function (result) {
                        return result.graphic.layer === clientLayer;
                    })[0].graphic;
                    highlight = layerView.highlight(graphic);
                }
            }
        });
    };
    loadClientLayer(mapView, cimLayer);
});
//# sourceMappingURL=main.js.map