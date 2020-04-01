var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"], function (require, exports, Map_1, MapView_1, FeatureLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    MapView_1 = __importDefault(MapView_1);
    FeatureLayer_1 = __importDefault(FeatureLayer_1);
    var map = new Map_1.default({
        basemap: "streets"
    });
    var mapView = new MapView_1.default({
        map: map,
        container: "viewDiv",
        center: [-118, 34],
        zoom: 4,
        highlightOptions: {
            color: "orange"
        }
    });
    var citiesLayer = new FeatureLayer_1.default({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0"
    });
    map.add(citiesLayer);
    // loading client side graphics from a featureLayer
    var loadClientLayer = function (view, featureLayer) {
        view
            .when()
            .then(function () {
            return featureLayer.when();
        })
            .then(function (layer) {
            return view.whenLayerView(layer);
        })
            .then(function (layerView) {
            view.on("pointer-move", eventHandler);
            view.on("pointer-down", eventHandler);
            function eventHandler(event) {
                view.hitTest(event).then(getGraphics);
            }
            //let highlight = layerView.highlight();
            var highlight = null;
            function getGraphics(response) {
                // obtaining the topmost graphic
                if (response.results.length) {
                    var graphic = response.results.filter(function (result) {
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
});
//# sourceMappingURL=main.js.map