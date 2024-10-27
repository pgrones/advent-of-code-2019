import { IntCodeComputer } from "../common.js";
import { input } from "./input.js";

const output = 19690720;
const numbers = input.split(",").map((x) => parseInt(x));

// --- PART 1 ---

const program = [...numbers];
program[1] = 12;
program[2] = 2;

const computer = new IntCodeComputer(program);
computer.run();

console.log(computer.memory[0]);

// --- PART 2 ---

outer: for (let noun = 0; noun <= 99; noun++) {
  for (let verb = 0; verb <= 99; verb++) {
    const program = [...numbers];
    program[1] = noun;
    program[2] = verb;

    const computer = new IntCodeComputer(program);
    computer.run();

    if (computer.memory[0] === output) {
      console.log(100 * noun + verb);
      break outer;
    }
  }
}
