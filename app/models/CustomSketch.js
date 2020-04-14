var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Graphic", "esri/symbols", "esri/symbols/SimpleMarkerSymbol"], function (require, exports, Graphic_1, symbols_1, SimpleMarkerSymbol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Graphic_1 = __importDefault(Graphic_1);
    SimpleMarkerSymbol_1 = __importDefault(SimpleMarkerSymbol_1);
    var CurrentSelectedBtn;
    (function (CurrentSelectedBtn) {
        CurrentSelectedBtn["CirclePointBtn"] = "pointButtonNumber";
        CurrentSelectedBtn["PinBtn"] = "pinBtn";
        CurrentSelectedBtn["TrashBtn"] = "resetBtn";
        CurrentSelectedBtn["PolylineBtn"] = "polylineBtn";
        CurrentSelectedBtn["PolygonBtn"] = "polygonBtn";
    })(CurrentSelectedBtn = exports.CurrentSelectedBtn || (exports.CurrentSelectedBtn = {}));
    var CustomSketch = /** @class */ (function () {
        function CustomSketch(graphicsLayer) {
            this.graphicsLayer = graphicsLayer;
        }
        CustomSketch.prototype.addGraphic = function (event, selectedBtnId, index) {
            if (event.state === "complete") {
                if (selectedBtnId === CurrentSelectedBtn.PinBtn) {
                    this.graphicsLayer.remove(event.graphic);
                    this.addPinBtn(event.graphic);
                }
                else if (selectedBtnId === CurrentSelectedBtn.CirclePointBtn) {
                    // add the CIM Symbol
                    this.graphicsLayer.remove(event.graphic);
                    var cimSymbol = new symbols_1.CIMSymbol({
                        data: this.getPointSymbolData(index),
                    });
                    var newGraphic = new Graphic_1.default({
                        geometry: event.graphic.geometry,
                        symbol: cimSymbol,
                    });
                    this.graphicsLayer.add(newGraphic);
                    //sketchViewModel.create("point");
                }
            }
        };
        CustomSketch.prototype.addPinBtn = function (graphic) {
            var pinSymbol = new SimpleMarkerSymbol_1.default({
                color: "#0079C1",
                size: "20px",
                path: "M15.999 0C11.214 0 8 1.805 8 6.5v17l7.999 8.5L24 23.5v-17C24 1.805 20.786 0 15.999 0zM16 14.402A4.4 4.4 0 0 1 11.601 10a4.4 4.4 0 1 1 8.798 0A4.4 4.4 0 0 1 16 14.402z",
            });
            var pinGraphic = new Graphic_1.default({
                geometry: graphic.geometry,
                symbol: pinSymbol,
            });
            this.graphicsLayer.add(pinGraphic);
            //model.create("point");
        };
        CustomSketch.prototype.getPointSymbolData = function (index) {
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
                                textString: String(index++),
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
        };
        return CustomSketch;
    }());
    exports.CustomSketch = CustomSketch;
});
//# sourceMappingURL=CustomSketch.js.map