import { instructions } from "./instructions.js";

const Modes = {
  Pointer: 0,
  Immediate: 1,
};

export class IntCodeComputer {
  #memory = [0];
  #pointer = 0;
  #instructions = instructions;

  get pointer() {
    return this.#pointer;
  }

  get memory() {
    return this.#memory;
  }

  constructor(program) {
    this.#memory = [...program];
  }

  run(input) {
    let instructionOpcode;
    while ((instructionOpcode = this.#memory[this.#pointer]) !== 99) {
      const [opcode, modes] = this.#parseOpcode(instructionOpcode.toString());

      const instruction = this.#instructions.find((x) => x.opcode === opcode);

      if (!instruction) throw new Error("Unknown opcode: " + opcode);

      const params = this.#getParams(instruction, modes);

      const nextPointer = instruction.execute(this.#memory, ...params, input);

      if (nextPointer !== undefined) this.#pointer = nextPointer;
      else this.#pointer += params.length + 1;
    }
  }

  #parseOpcode(instructionOpcode) {
    if (instructionOpcode.length === 1)
      return [parseInt(instructionOpcode), []];

    const [opCodePart1, opCodePart0, ...modes] = [
      ...instructionOpcode,
    ].toReversed();
    const opcode = parseInt(opCodePart0 + opCodePart1);

    return [opcode, modes.map((x) => parseInt(x))];
  }

  #getParams(instruction, modes) {
    const params = instruction.getParams(this.#memory, this.#pointer);

    return params.map((param, index) => {
      if (instruction.hasAddressParam && index === params.length - 1)
        return param;

      const mode = modes[index] ?? Modes.Pointer;

      if (mode === Modes.Pointer) return this.#memory[param];

      return param;
    });
  }
}
