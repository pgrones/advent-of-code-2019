import { IntCodeComputer } from "../common/intCodeComputer.js";
import { input } from "./input.js";
import * as readline from "node:readline";

const program = input.split(",").map((x) => parseInt(x));

// --- PART 1 ---

let computer = new IntCodeComputer(program);
computer.run();

const countBlocks = () => {
  return computer.outputBuffer.reduce((acc, curr, i) => {
    if ((i + 1) % 3 !== 0) return acc;

    if (curr !== 2) return acc;

    return acc + 1;
  }, 0);
};

console.log(countBlocks());

// --- PART 2 ---

computer = new IntCodeComputer([2, ...program.slice(1)]);
let bufferLength = 0;

while (true) {
  const ballIndex =
    computer.outputBuffer.findLastIndex(
      (x, i) => (i + 1) % 3 === 0 && x === 4
    ) - 2;
  const paddleIndex =
    computer.outputBuffer.findLastIndex(
      (x, i) => (i + 1) % 3 === 0 && x === 3
    ) - 2;

  const bx = computer.outputBuffer[ballIndex];
  const px = computer.outputBuffer[paddleIndex];

  computer.run([bx < px ? -1 : bx > px ? 1 : 0].values());

  const newTiles = bufferLength
    ? computer.outputBuffer.slice(
        computer.outputBuffer.length -
          (computer.outputBuffer.length - bufferLength)
      )
    : [];

  const deleteIndices = [];
  for (let i = 0; i < newTiles.length; i += 3) {
    const [x, y] = newTiles.slice(i, i + 2);

    for (
      let j = 0;
      j < computer.outputBuffer.length - newTiles.length;
      j += 3
    ) {
      const [x1, y1] = computer.outputBuffer.slice(j, j + 2);

      if (x === x1 && y === y1) {
        deleteIndices.push(j);
        break;
      }
    }
  }

  for (const index of deleteIndices.toSorted((a, b) => b - a)) {
    computer.outputBuffer.splice(index, 3);
  }

  bufferLength = computer.outputBuffer.length;

  if (countBlocks() === 0) {
    console.log(
      computer.outputBuffer[
        computer.outputBuffer.findLastIndex((x) => x === -1) + 2
      ]
    );
    break;
  }
}

// --- PART 2 BONUS ---

const drawFrame = (tiles) => {
  const matrix = [];
  let score = 0;
  let blocks = 0;

  for (let i = 0; i < tiles.length; i += 3) {
    const [x, y, id] = tiles.slice(i, i + 3);

    if (x === -1 && y === 0) {
      score = id;
      continue;
    }

    if (!matrix[y]) matrix[y] = [];

    switch (id) {
      case 0:
        matrix[y][x] = " ";
        break;
      case 1:
        matrix[y][x] = y === 0 ? "-" : "|";
        break;
      case 2:
        matrix[y][x] = "#";
        blocks++;
        break;
      case 3:
        matrix[y][x] = "‾";
        break;
      case 4:
        matrix[y][x] = "o";
        if (y === 21) return true;
        break;
    }
  }

  console.log("\nSCORE: " + score + "\t\t    q to quit");

  for (const row of matrix) {
    console.log(row.join(""));
  }

  return blocks === 0;
};

computer = new IntCodeComputer([2, ...program.slice(1)]);

bufferLength = 0;
const computeFrame = (input) => {
  computer.run([input].values());

  const newTiles = bufferLength
    ? computer.outputBuffer.slice(
        computer.outputBuffer.length -
          (computer.outputBuffer.length - bufferLength)
      )
    : [];

  const deleteIndices = [];
  for (let i = 0; i < newTiles.length; i += 3) {
    const [x, y] = newTiles.slice(i, i + 2);

    for (
      let j = 0;
      j < computer.outputBuffer.length - newTiles.length;
      j += 3
    ) {
      const [x1, y1] = computer.outputBuffer.slice(j, j + 2);

      if (x === x1 && y === y1) {
        deleteIndices.push(j);
        break;
      }
    }
  }

  for (const index of deleteIndices.toSorted((a, b) => b - a)) {
    computer.outputBuffer.splice(index, 3);
  }

  bufferLength = computer.outputBuffer.length;

  const gameOver = drawFrame(computer.outputBuffer);

  return gameOver;
};

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (_, { name }) => {
  if (name === "q") process.exit();
  if (!["left", "right", "down"].includes(name)) return;

  let gameOver = false;

  switch (name) {
    case "left":
      gameOver = computeFrame(-1);
      break;
    case "right":
      gameOver = computeFrame(1);
      break;
    case "down":
      gameOver = computeFrame(0);
      break;
  }

  if (gameOver) process.exit();
});

computeFrame(0);
