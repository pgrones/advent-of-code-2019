const Opcodes = {
  Unknown: 0,
  Add: 1,
  Multiply: 2,
  Save: 3,
  Output: 4,
  JumpIfTrue: 5,
  JumpIfFalse: 6,
  LessThan: 7,
  Equals: 8,
  AdjustRelativeBase: 9,
};

class Instruction {
  constructor(opcode, hasAddressParam, getParams, execute) {
    this.opcode = opcode;
    this.hasAddressParam = hasAddressParam;
    this.getParams = getParams;
    this.execute = execute;
  }
}

export const instructions = [
  new Instruction(
    Opcodes.Add,
    true,
    (memory, pointer) => memory.slice(pointer + 1, pointer + 4),
    (memory, a, b, pos) => {
      memory[pos] = a + b;
    }
  ),
  new Instruction(
    Opcodes.Multiply,
    true,
    (memory, pointer) => memory.slice(pointer + 1, pointer + 4),
    (memory, a, b, pos) => {
      memory[pos] = a * b;
    }
  ),
  new Instruction(
    Opcodes.Save,
    true,
    (memory, pointer) => [memory[pointer + 1]],
    (memory, pos, input) => {
      memory[pos] = input.next?.().value ?? input;
    }
  ),
  new Instruction(
    Opcodes.Output,
    false,
    (memory, pointer) => [memory[pointer + 1]],
    (_, value) => {
      return { output: value };
    }
  ),
  new Instruction(
    Opcodes.JumpIfTrue,
    false,
    (memory, pointer) => memory.slice(pointer + 1, pointer + 3),
    (_, operand, value) => {
      if (operand !== 0) return { nextPointer: value };
    }
  ),
  new Instruction(
    Opcodes.JumpIfFalse,
    false,
    (memory, pointer) => memory.slice(pointer + 1, pointer + 3),
    (_, operand, value) => {
      if (operand === 0) return { nextPointer: value };
    }
  ),
  new Instruction(
    Opcodes.LessThan,
    true,
    (memory, pointer) => memory.slice(pointer + 1, pointer + 4),
    (memory, a, b, pos) => {
      memory[pos] = a < b ? 1 : 0;
    }
  ),
  new Instruction(
    Opcodes.Equals,
    true,
    (memory, pointer) => memory.slice(pointer + 1, pointer + 4),
    (memory, a, b, pos) => {
      memory[pos] = a === b ? 1 : 0;
    }
  ),
  new Instruction(
    Opcodes.AdjustRelativeBase,
    false,
    (memory, pointer) => [memory[pointer + 1]],
    (_, relativeBaseOffset) => {
      return { relativeBaseOffset };
    }
  ),
];
