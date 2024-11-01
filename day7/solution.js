import { IntCodeComputer } from "../common/intCodeComputer.js";
import { input } from "./input.js";

const program = input.split(",").map((x) => parseInt(x));

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

function* inputGenerator(phase, signal) {
  yield phase;
  yield signal;
}

let phaseSettings = permute([0, 1, 2, 3, 4]);
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

// --- PART 2 ---

phaseSettings = permute([5, 6, 7, 8, 9]);
maxSignal = -Infinity;

for (const phaseSetting of phaseSettings) {
  const amplifiers = phaseSetting.map(() => new IntCodeComputer(program));
  const n = amplifiers.length;
  let i = 0;
  let firstRun = true;
  let haltedPrograms = 0;
  let outputs = [0];

  while (true) {
    const inputs = [...outputs];

    if (firstRun) inputs.unshift(phaseSetting[i]);

    const result = amplifiers[i].run(inputs.values());
    if (result === "halt") haltedPrograms++;

    if (haltedPrograms === n) break;

    outputs = [...amplifiers[i].outputBuffer];
    amplifiers[i].outputBuffer.length = 0;

    i = (i + (1 % n) + n) % n;

    if (i === 0) firstRun = false;
  }

  maxSignal = Math.max(maxSignal, amplifiers.at(-1).outputBuffer.at(-1));
}

console.log(maxSignal);
