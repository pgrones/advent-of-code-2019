import { input } from "./input.js";

const [wire1, wire2] = input.split("\n").map((x) => x.split(","));

const tracePath = (wire) => {
  const path = new Set();
  const completePath = [];
  let currPos = [0, 0];

  for (const instruction of wire) {
    const [dir, ...length] = instruction;
    const count = parseInt(length.join(""));

    for (let i = 0; i < count; i++) {
      switch (dir) {
        case "U":
          currPos = [currPos[0], currPos[1] + 1];
          break;
        case "D":
          currPos = [currPos[0], currPos[1] - 1];
          break;
        case "R":
          currPos = [currPos[0] + 1, currPos[1]];
          break;
        case "L":
          currPos = [currPos[0] - 1, currPos[1]];
          break;
        default:
          break;
      }

      path.add(currPos[0].toString() + "," + currPos[1].toString());
      completePath.push(currPos);
    }
  }

  return [path, completePath];
};

const [path1, completePath1] = tracePath(wire1);
const [path2, completePath2] = tracePath(wire2);
const paths = [path1, path2].toSorted((a, b) => b.size - a.size);
const intersections = [];

const path1AsArray = [...paths[0]];

for (let i = 0; i < path1AsArray.length; i++) {
  const coords = path1AsArray[i];

  if (paths[1].has(coords))
    intersections.push(coords.split(",").map((x) => parseInt(x)));
}

// --- PART 1 ---

let smallestDistance = Infinity;

for (const [x, y] of intersections) {
  const distance = Math.abs(x) + Math.abs(y);
  smallestDistance = Math.min(distance, smallestDistance);
}

console.log(smallestDistance);

// --- PART 2 ---

let leastSteps = Infinity;

for (const [x, y] of intersections) {
  const steps1 = completePath1.findIndex((z) => z[0] === x && z[1] === y);
  const steps2 = completePath2.findIndex((z) => z[0] === x && z[1] === y);
  const steps = steps1 + steps2 + 2;
  leastSteps = Math.min(steps, leastSteps);
}

console.log(leastSteps);
