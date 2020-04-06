# express-map-jsapi

Mimicking the express-map from the ArcGIS StoryMaps using the ArcGIS API for JavaScript

![Express JSAPI](https://github.com/banuelos27/express-map-jsapi/blob/master/map-screenshot.png)

## How to use the sample

1. Click on the 1 in the SketchWidget to start adding points to the map.
2. Each point will have an index number associated with it that displays on top of each circle graphic.
3. The symbol being used is a [CIMSymbol Cartographic Information Model](https://developers.arcgis.com/javascript/latest/api-reference/esri-symbols-CIMSymbol.html)
4. After adding the CIM symbols to the Map, you can hover over the symbols to highlight the symbols
5. The highlighting is taken care of using the [hitTest](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#hitTest) method of the [MapView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html).

## Getting Started

On the intitial download or clone of this repository run

### `npm install`

Installs all the package dependencies.

In the root project directory, you can run

### `tsc -w`

to compile and watch for any changes in the code.

## Deployment

The index.html file will be ready for deployment on a webserver, or just by double-clicking the file to launch from the local file directory.
