var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/geometry/Point", "esri/layers/GraphicsLayer", "esri/Graphic"], function (require, exports, Point_1, GraphicsLayer_1, Graphic_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Point_1 = __importDefault(Point_1);
    GraphicsLayer_1 = __importDefault(GraphicsLayer_1);
    Graphic_1 = __importDefault(Graphic_1);
    var point1 = new Point_1.default({
        longitude: -112.5,
        latitude: 34.5,
    });
    var point2 = new Point_1.default({
        longitude: -116,
        latitude: 34.5,
    });
    var point3 = new Point_1.default({
        longitude: -117,
        latitude: 38,
    });
    var sym = {
        type: "simple-marker",
        style: "circle",
        color: "orange",
        size: "14px",
    };
    var graphic1 = new Graphic_1.default({
        geometry: point1,
        symbol: sym,
    });
    var graphic2 = new Graphic_1.default({
        geometry: point2,
        symbol: sym,
    });
    var graphic3 = new Graphic_1.default({
        geometry: point3,
        symbol: sym,
    });
    var graphicsLayer = new GraphicsLayer_1.default();
    graphicsLayer.addMany([graphic1, graphic2, graphic3]);
    exports.default = graphicsLayer;
});
//# sourceMappingURL=TestGraphicsLayer.js.map