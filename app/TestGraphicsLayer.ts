// this file represents the GraphicsLayer being used for testing logic
// adding 3 point graphics and returning the GraphicsLayer to be used in the main.ts file
import Point from "esri/geometry/Point";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Graphic from "esri/Graphic";

const point1 = new Point({
  longitude: -112.5,
  latitude: 34.5,
});

const point2 = new Point({
  longitude: -116,
  latitude: 34.5,
});

const point3 = new Point({
  longitude: -117,
  latitude: 38,
});

const sym = {
  type: "simple-marker",
  style: "circle",
  color: "orange",
  size: "14px",
};

const graphic1 = new Graphic({
  geometry: point1,
  symbol: sym,
});

const graphic2 = new Graphic({
  geometry: point2,
  symbol: sym,
});

const graphic3 = new Graphic({
  geometry: point3,
  symbol: sym,
});

const graphicsLayer = new GraphicsLayer();

graphicsLayer.addMany([graphic1, graphic2, graphic3]);

export default graphicsLayer;
