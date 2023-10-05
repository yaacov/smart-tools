import { opcodes } from './opcodes.mjs';
import { throwFormattedError } from './debug.mjs';

class VM {
  constructor(memorySize = 256) {
    this.memory = new Array(memorySize).fill(0);
    this.registerA = 0;
    this.registerB = 0;
    this.pc = 0;
    this.sp = 0;
  }

  pop() {
    return this.memory[--this.sp];
  }

  push(value) {
    this.memory[this.sp++] = value;
  }

  /**
   * Executes the current instruction in memory.
   *
   * @returns {boolean} - Returns true if execution should continue, false otherwise.
   */
  execute() {
    // Load instraction and address registers
    const instruction = this.memory[this.pc];
    const address = this.memory[this.pc + 1];

    // Update base pointer, base pointer is one less then current stack pointer
    // to allow for [BP + 0] to point to return address.
    const bp = this.sp - 1;

    // Bump pc +2 = code + address pair
    this.pc += 2;

    const handlers = {
      [opcodes.NOP]: () => true,
      [opcodes.END]: () => false,

      // Memory operations
      [opcodes.STOREA]: () => this.memory[address] = this.registerA,
      [opcodes.STOREB]: () => this.memory[address] = this.registerB,

      // Arithmetic operations
      [opcodes.LOADA]: () => this.registerA = this.memory[address],
      [opcodes.LOADB]: () => this.registerB = this.memory[address],
      [opcodes.ORA]: () => this.registerA |= this.memory[address],
      [opcodes.ORB]: () => this.registerB |= this.memory[address],
      [opcodes.ANDA]: () => this.registerA &= this.memory[address],
      [opcodes.ANDB]: () => this.registerB &= this.memory[address],
      [opcodes.XORA]: () => this.registerA ^= this.memory[address],
      [opcodes.XORB]: () => this.registerB ^= this.memory[address],
      [opcodes.NOTA]: () => this.registerA = ~this.registerA & 0xff,
      [opcodes.NOTB]: () => this.registerB = ~this.registerB & 0xff,
      [opcodes.SHLA]: () => this.registerA = (this.registerA << address) & 0xff,
      [opcodes.SHLB]: () => this.registerB = (this.registerB << address) & 0xff,
      [opcodes.SHRA]: () => this.registerA >>= address,
      [opcodes.SHRB]: () => this.registerB >>= address,
      [opcodes.ADDA]: () => this.registerA = (this.registerA + this.memory[address]) & 0xff,
      [opcodes.ADDB]: () => this.registerB = (this.registerB + this.memory[address]) & 0xff,

      // Jump operations
      [opcodes.JUMP]: () => this.pc = address,
      [opcodes.JZA]: () => this.pc = this.registerA === 0 ? address : this.pc,
      [opcodes.JZB]: () => this.pc = this.registerB === 0 ? address : this.pc,

      // Stack operations
      [opcodes.SETBP]: () => this.sp = address,
      [opcodes.PUSH]: () => this.push(this.memory[address]),
      [opcodes.POP]: () => this.memory[address] = this.pop(),
      [opcodes.CALL]: () => { this.push(this.pc); this.pc = address; },
      [opcodes.RET]: () => this.pc = this.pop(),
      [opcodes.LOADABP]: () => this.registerA = this.memory[(bp - address) & 0xff],
      [opcodes.STOREABP]: () => this.memory[(bp - address) & 0xff] = this.registerA,
    };

    // Try to execute one instruction + address pair
    if (instruction in handlers) {
      handlers[instruction]();
    } else {
      throwFormattedError('Invalid instruction', instruction, this.pc);
    }

    // Exit on end
    if (instruction === opcodes.END) {
      return false;
    }

    return true;
  }

  /**
   * Loads a program into the memory.
   *
   * @param {number[]} program - An array of numbers representing the program to be loaded.
   */
  loadProgram(program) {
    for (let i = 0; i < program.length && i < this.memory.length; i++) {
      this.memory[i] = program[i];
    }
  }

  /**
   * Runs the loaded program until completion.
   */
  run() {
    while (this.execute()) { /* empty */ }
  }
}

export default VM;
