var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/GraphicsLayer", "esri/widgets/Sketch/SketchViewModel", "./models/CustomSketch"], function (require, exports, Map_1, MapView_1, GraphicsLayer_1, SketchViewModel_1, CustomSketch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    MapView_1 = __importDefault(MapView_1);
    GraphicsLayer_1 = __importDefault(GraphicsLayer_1);
    SketchViewModel_1 = __importDefault(SketchViewModel_1);
    var drawPointButtonNumber = document.getElementById("pointButtonNumber");
    var drawPinBtn = document.getElementById("pinBtn");
    var drawPolylineBtn = document.getElementById("polylineBtn");
    var drawPolygonBtn = document.getElementById("polygonBtn");
    var deleteBtn = document.getElementById("deleteBtn");
    var drawArrowBtn = document.getElementById("arrowBtn");
    // HTMLInputElement allows us to use the disabled property
    var undoBtn = document.getElementById("undoBtn");
    undoBtn.disabled = true;
    var redoBtn = document.getElementById("redoBtn");
    redoBtn.disabled = true;
    var graphicsLayer = new GraphicsLayer_1.default();
    var numberIndex = 1;
    var selectedBtn;
    var selectedGraphic = null;
    var isGraphicClick = false;
    var isArrowDrawEnabled = false;
    var sketchViewModel = null;
    var customSketch = null;
    var map = new Map_1.default({
        basemap: "gray-vector",
        layers: [graphicsLayer],
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
        // const sketch = new Sketch({
        //   layer: graphicsLayer,
        //   view: mapView,
        //   container: "topbar",
        //   availableCreateTools: ["rectangle", "circle"],
        // });
        // mapView.ui.add(sketch, "top-right");
        sketchViewModel = new SketchViewModel_1.default({
            view: mapView,
            layer: graphicsLayer,
        });
        customSketch = new CustomSketch_1.CustomSketch(graphicsLayer);
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
                if (selectedBtn.id === CustomSketch_1.CurrentSelectedBtn.CirclePointBtn) {
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
        function getCimNumber(graphic) {
            return parseInt(graphic.symbol.data.symbolLayers[0].markerGraphics[0].symbol.textString);
        }
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
    undoBtn.onclick = function () {
        if (sketchViewModel.state !== "active") {
            undoBtn.disabled = true;
        }
        else {
            sketchViewModel.undo();
        }
    };
    redoBtn.onclick = function () {
        sketchViewModel.redo();
    };
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
            // view.on("drag", function (e) {
            //   console.log(e);
            //   // e.stopPropagation();
            // });
            view.on("drag", function (e) {
                if (isArrowDrawEnabled) {
                    dragEventHandler(e, view);
                }
            });
            function eventHandler(event) {
                // using the hitTest() of the MapView to identify graphics on the screen
                isGraphicClick = event.type === "pointer-down" ? true : false;
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
                    // display the trash can to delete the currently selected graphic
                    if (isGraphicClick) {
                        deleteBtn.style.visibility = "visible";
                        selectedGraphic = graphic;
                    }
                }
            }
        });
    };
    function dragEventHandler(e, view) {
        e.stopPropagation();
        if (e.origin.x !== e.x && e.origin.y !== e.y) {
            var arrow = customSketch.drawArrow(e.origin, { x: e.x, y: e.y }, view);
            view.graphics.removeAll();
            view.graphics.addMany(arrow);
            if (e.action === "end") {
                graphicsLayer.addMany(arrow);
                isArrowDrawEnabled = false;
            }
        }
    }
    loadClientLayer(mapView, graphicsLayer);
});
//# sourceMappingURL=main.js.map