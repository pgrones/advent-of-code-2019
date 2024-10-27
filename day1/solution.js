import { input } from "./input.js";

const modules = input.split("\n").map((x) => parseInt(x));

const calculateFuel = (mass) => Math.floor(mass / 3) - 2;

// --- PART 1 ---

console.log(modules.reduce((acc, curr) => acc + calculateFuel(curr), 0));

// --- PART 2 ---

let totalFuel = 0;
for (const module of modules) {
  let currFuel = calculateFuel(module);

  while (currFuel > 0) {
    totalFuel += currFuel;
    currFuel = calculateFuel(currFuel);
  }
}

console.log(totalFuel);
