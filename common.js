export class IntCodeComputer {
  #memory = [];
  #pointer = 0;

  get pointer() {
    return this.#pointer;
  }

  get memory() {
    return this.#memory;
  }

  constructor(program) {
    this.#memory = program;
  }

  run() {
    let opcode;
    while ((opcode = this.#memory[this.#pointer]) !== 99) {
      this.#execute(opcode);
    }
  }

  #execute(opcode) {
    let params = [];

    switch (opcode) {
      case 1:
        params = this.#memory.slice(this.#pointer + 1, this.#pointer + 4);
        this.#add(...params);
        break;
      case 2:
        params = this.#memory.slice(this.#pointer + 1, this.#pointer + 4);
        this.#multiply(...params);
        break;
      default:
        throw new Error("Unknown opcode: " + opcode);
    }

    this.#pointer += params.length + 1;
  }

  #add(posA, posB, posOut) {
    const a = this.#memory[posA];
    const b = this.#memory[posB];

    this.#memory[posOut] = a + b;
  }

  #multiply(posA, posB, posOut) {
    const a = this.#memory[posA];
    const b = this.#memory[posB];

    this.#memory[posOut] = a * b;
  }
}
