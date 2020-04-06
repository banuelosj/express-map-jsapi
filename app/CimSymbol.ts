// custom CIMSymbol class to always use the blue circle icon with
// a number count
import CIMSymbol from "esri/symbols/CIMSymbol";

export class CimSymbol extends CIMSymbol {
  // numberIndex is number to start with for symbol numbers
  constructor(public numberIndex: number, public data: any) {
    super();
  }

  getIndex = (): number => {
    return this.numberIndex;
  };

  setIndex = (index: number): void => {
    this.numberIndex = index;
  };

  getData = (): {} => {
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
              textString: String(this.numberIndex++),
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
}
