var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "./TestGraphicsLayer"], function (require, exports, Map_1, MapView_1, TestGraphicsLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    MapView_1 = __importDefault(MapView_1);
    TestGraphicsLayer_1 = __importDefault(TestGraphicsLayer_1);
    var map = new Map_1.default({
        basemap: "gray-vector",
    });
    var mapView = new MapView_1.default({
        map: map,
        container: "viewDiv",
        center: [-118, 34],
        zoom: 4,
        highlightOptions: {
            color: "blue",
        },
    });
    var graphicsLayer = TestGraphicsLayer_1.default;
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
    loadClientLayer(mapView, graphicsLayer);
});
//# sourceMappingURL=main.js.map