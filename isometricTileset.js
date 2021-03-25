// scale the image if total is too high
const tileScale = 1;

// actual image dimensions
const tileOriginalWidth = 200;
const highestTileOriginalHeight = 210;
const numberOfTileVariations = 7;

// calculated dimensions based on scale
const tileWidth = tileOriginalWidth * tileScale;
const tileHeight = tileWidth / 2;
const isometricSkew = 1.73;
const highestTileHeight = highestTileOriginalHeight * tileScale;

let lowestIsoX = 0;
let highestIsoX = 0;
let highestIsoY = 0;

const tiles = [];

for (let i = total; i >= 1; i--) {
  const blockCoordinates = layout.getMapTileCoordinates(i);

  const isoX =
    (blockCoordinates.x * tileWidth) / 2 - blockCoordinates.y * tileHeight;
  const isoY =
    ((blockCoordinates.x * tileWidth) / 2 + blockCoordinates.y * tileHeight) /
    isometricSkew;

  if (lowestIsoX > isoX) {
    lowestIsoX = isoX;
  }
  if (highestIsoX < isoX) {
    highestIsoX = isoX;
  }
  if (highestIsoY < isoY) {
    highestIsoY = isoY;
  }

  const tileNumber = Math.floor(Math.random() * numberOfTileVariations) + 1;

  tiles.push({ tileNumber, isoX, isoY });
}
