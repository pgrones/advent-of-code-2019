import { IntCodeComputer } from "../common/intCodeComputer.js";
import { input } from "./input.js";

const program = input.split(",").map((x) => parseInt(x));

// --- PART 1 ---

new IntCodeComputer(program).run(1);

// --- PART 2 ---

new IntCodeComputer(program).run(5);
