import { IntCodeComputer } from "../common/intCodeComputer.js";
import { input } from "./input.js";

const program = input.split(",").map((x) => parseInt(x));

// --- PART 1 ---

let computer = new IntCodeComputer(program);
computer.run(1);
console.log(computer.outputBuffer.at(-1));

// --- PART 2 ---

computer = new IntCodeComputer(program);
computer.run(5);
console.log(computer.outputBuffer.at(-1));
