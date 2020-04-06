var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/symbols/CIMSymbol"], function (require, exports, CIMSymbol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    CIMSymbol_1 = __importDefault(CIMSymbol_1);
    var CimSymbol = /** @class */ (function (_super) {
        __extends(CimSymbol, _super);
        // numberIndex is number to start with for symbol numbers
        function CimSymbol(numberIndex, data) {
            var _this = _super.call(this) || this;
            _this.numberIndex = numberIndex;
            _this.data = data;
            _this.getIndex = function () {
                return _this.numberIndex;
            };
            _this.setIndex = function (index) {
                _this.numberIndex = index;
            };
            _this.getData = function () {
                return {
                    type: "CIMPointSymbol",
                    symbolLayers: [
                        {
                            type: "CIMVectorMarker",
                            enable: true,
                            size: 25,
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
                                    textString: String(_this.numberIndex++),
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
                            size: 25,
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
            return _this;
        }
        return CimSymbol;
    }(CIMSymbol_1.default));
    exports.CimSymbol = CimSymbol;
});
//# sourceMappingURL=CimSymbol.js.map