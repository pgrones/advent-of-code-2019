import { IntCodeComputer } from "../common/intCodeComputer.js";
import { input } from "./input.js";

const program = input.split(",").map((x) => parseInt(x));

const run = (startColor) => {
  const panels = new Map([["0,0", startColor]]);
  const computer = new IntCodeComputer(program);
  let currPos = [0, 0, "U"];

  const paintPanel = (x, y, color) => {
    const key = x.toString() + "," + y.toString();
    panels.set(key, color);
  };

  const getColor = (x, y) => {
    const key = x.toString() + "," + y.toString();
    return panels.get(key) ?? 0;
  };

  while (computer.run([getColor(currPos[0], currPos[1])].values()) !== "halt") {
    const [x, y, dir] = currPos;
    const [color, turn] = computer.outputBuffer.slice(-2);

    paintPanel(x, y, color);

    switch (dir + turn) {
      case "U0":
        currPos = [x - 1, y, "L"];
        break;
      case "U1":
        currPos = [x + 1, y, "R"];
        break;
      case "L0":
        currPos = [x, y + 1, "D"];
        break;
      case "L1":
        currPos = [x, y - 1, "U"];
        break;
      case "D0":
        currPos = [x + 1, y, "R"];
        break;
      case "D1":
        currPos = [x - 1, y, "L"];
        break;
      case "R0":
        currPos = [x, y - 1, "U"];
        break;
      case "R1":
        currPos = [x, y + 1, "D"];
        break;
    }
  }

  return panels;
};

// --- PART 1 ---

console.log(run(0).size);

// --- PART 2 ---

const panels = run(1);
const matrix = [];

for (const [key, value] of panels.entries()) {
  const [x, y] = key.split(",").map((x) => parseInt(x));

  if (!matrix[y]) matrix[y] = [];

  matrix[y][x] = value ? "#" : " ";
}

for (const row of matrix) {
  for (let i = 0; i < row.length; i++) {
    if (!(i in row)) row[i] = " ";
  }

  console.log(row.join(""));
}
