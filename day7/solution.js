import { IntCodeComputer } from "../common/intCodeComputer.js";
import { input } from "./input.js";

const program = input.split(",").map((x) => parseInt(x));

function* inputGenerator(phase, signal) {
  yield phase;
  yield signal;
}

// yoinked from https://stackoverflow.com/questions/9960908/permutations-in-javascript
const permute = (inputArr) => {
  const result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
};

// --- PART 1 ---

const phaseSettings = permute([0, 1, 2, 3, 4]);

let maxSignal = -Infinity;
for (const phaseSetting of phaseSettings) {
  let signal = 0;

  for (const phase of phaseSetting) {
    const amplifier = new IntCodeComputer(program);
    amplifier.run(inputGenerator(phase, signal));
    signal = amplifier.outputBuffer.at(-1);
    maxSignal = Math.max(maxSignal, signal);
  }
}

console.log(maxSignal);
