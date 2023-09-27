import opcodes from './opcodes.mjs';
import {
  formatHexByte, formatBinary, formatAddress,
} from './utils.mjs';

class VM {
  constructor(memorySize = 256) {
    this.memory = new Array(memorySize).fill(0);
    this.registerA = 0;
    this.registerB = 0;
    this.pc = 0;
  }

  fetchOperand() {
    this.pc++;
    return this.memory[this.pc];
  }

  /**
   * Executes the current instruction in memory.
   *
   * @returns {boolean} - Returns true if execution should continue, false otherwise.
   */
  execute() {
    let jumpFlag = false;

    const handlers = {
      [opcodes.LOADA]: () => this.registerA = this.memory[this.fetchOperand()],
      [opcodes.LOADB]: () => this.registerB = this.memory[this.fetchOperand()],
      [opcodes.STOREA]: () => this.memory[this.fetchOperand()] = this.registerA,
      [opcodes.STOREB]: () => this.memory[this.fetchOperand()] = this.registerB,
      [opcodes.ORA]: () => this.registerA |= this.memory[this.fetchOperand()],
      [opcodes.ORB]: () => this.registerB |= this.memory[this.fetchOperand()],
      [opcodes.ANDA]: () => this.registerA &= this.memory[this.fetchOperand()],
      [opcodes.ANDB]: () => this.registerB &= this.memory[this.fetchOperand()],
      [opcodes.XORA]: () => this.registerA ^= this.memory[this.fetchOperand()],
      [opcodes.XORB]: () => this.registerB ^= this.memory[this.fetchOperand()],
      [opcodes.NOTA]: () => this.registerA = ~this.registerA & 0xff,
      [opcodes.NOTB]: () => this.registerB = ~this.registerB & 0xff,
      [opcodes.SHLA]: () => { this.registerA = (this.registerA << this.fetchOperand()) & 0xff; },
      [opcodes.SHLB]: () => { this.registerB = (this.registerB << this.fetchOperand()) & 0xff; },
      [opcodes.SHRA]: () => this.registerA >>= this.fetchOperand(),
      [opcodes.SHRB]: () => this.registerB >>= this.fetchOperand(),
      [opcodes.JUMPA]: () => { this.pc++; if (this.registerA !== 0) { this.pc = this.memory[this.pc]; jumpFlag = true; } },
      [opcodes.JUMPB]: () => { this.pc++; if (this.registerB !== 0) { this.pc = this.memory[this.pc]; jumpFlag = true; } },
      [opcodes.JZA]: () => { this.pc++; if (this.registerA === 0) { this.pc = this.memory[this.pc]; jumpFlag = true; } },
      [opcodes.JZB]: () => { this.pc++; if (this.registerB === 0) { this.pc = this.memory[this.pc]; jumpFlag = true; } },
      [opcodes.ADDA]: () => { this.registerA = (this.registerA + this.memory[this.fetchOperand()]) & 0xff; },
      [opcodes.ADDB]: () => { this.registerB = (this.registerB + this.memory[this.fetchOperand()]) & 0xff; },
      [opcodes.END]: () => false,
    };

    const instruction = this.memory[this.pc];
    if (handlers[instruction]) {
      handlers[instruction]();
    } else {
      const formattedInstructionHex = formatHexByte(instruction);
      const formattedInstructionBinary = formatBinary(instruction, 8); // Assuming 8 bits for the instruction
      const formattedAddressHex = formatAddress(this.pc);
      const formattedAddressDecimal = this.pc;

      const errorMessage = `Invalid instruction [${formattedInstructionHex} | ${formattedInstructionBinary}] at address ${formattedAddressHex} (${formattedAddressDecimal})!`;
      throw new Error(errorMessage);
    }

    // Dont incriment the counter on jumps
    if (!jumpFlag) {
      this.pc++;
    }

    if (this.pc >= this.memory.length) {
      this.pc = 0;
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
