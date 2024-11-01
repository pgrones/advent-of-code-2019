import { input } from "./input.js";

const pixels = input.split("").map((x) => parseInt(x));

const width = 25;
const height = 6;
const layerSize = height * width;
const layers = [];

// ---PART 1 ---

let zeroes = Infinity;
let result = 0;

for (let i = 0; i < pixels.length; i += layerSize) {
  const layer = pixels.slice(i, i + layerSize);
  layers.push(layer);

  const counts = layer.reduce(
    (acc, curr) => acc.with(curr, acc[curr] + 1),
    [0, 0, 0]
  );

  if (counts[0] < zeroes) {
    zeroes = counts[0];
    result = counts[1] * counts[2];
  }
}

console.log(result);

// --- PART 2 ---

for (let y = 0; y < height; y++) {
  let row = "";

  for (let x = 0; x < width; x++) {
    const pixelIndex = x + width * y;

    for (const layer of layers) {
      if (layer[pixelIndex] === 2) continue;

      row += layer[pixelIndex] ? "#" : " ";
      break;
    }
  }

  console.log(row);
}
