import opcodes from './opcodes.mjs';
import {
  findKeyByValue, formatAddress, formatHexByte, formatBinary,
} from './utils.mjs';

/**
 * Removes comments from a line of assembly code.
 * @param {string} line - A line of assembly code.
 * @returns {string} - The line without comments.
 */
function removeComments(line) {
  const commentIndex = line.indexOf(';');
  if (commentIndex !== -1) {
    return line.substring(0, commentIndex).trim();
  }
  return line.trim();
}

/**
 * Ensures there's a space after a label colon in a line of assembly code.
 * @param {string} line - A line of assembly code.
 * @returns {string} - The line with ensured space after label colon.
 */
function ensureSpaceAfterLabel(line) {
  const labelPattern = /([A-Z0-9]+:)([A-Z0-9]+)/i;
  return line.replace(labelPattern, '$1 $2');
}

/**
 * Parses a value string and returns its integer representation.
 * Supports decimal, hexadecimal (with '0x' prefix), and binary (with '0b' prefix).
 * @param {string} value - The value string to parse.
 * @returns {number} - The integer representation of the value.
 */
function parseValue(value) {
  if (value.startsWith('0x')) {
    return parseInt(value, 16); // Parse as hexadecimal
  } if (value.startsWith('0b')) {
    return parseInt(value, 2); // Parse as binary
  }
  return parseInt(value, 10); // Parse as decimal
}

function isLabel(instruction) {
  return instruction.endsWith(':');
}

/**
 * Processes a label and updates the address counter.
 * @param {string} instruction - The instruction to process.
 * @param {string[]} operands - The operands associated with the instruction.
 * @param {Object} labels - The labels object to update.
 * @param {number} address - The current address counter.
 * @returns {number} - The updated address counter.
 */
function processLabel(instruction, operands, labels, address) {
  if (isLabel(instruction)) {
    const label = instruction.slice(0, -1);
    labels[address] = label;
    instruction = operands.shift(); // Adjust for the actual instruction after the label
  }

  if (instruction === 'DATA') {
    address += operands.length; // For each data value
  } else if (opcodes[instruction] !== undefined) {
    address += 1; // For the opcode
    address += operands.length; // For each operand
  }

  return address; // Return the updated address
}

/**
 * Processes an instruction and updates the memory array.
 * @param {string} instruction - The instruction to process.
 * @param {string[]} operands - The operands associated with the instruction.
 * @param {number[]} memory - The memory array to update.
 * @param {Object} labels - The labels object for operand resolution.
 */
function processInstruction(instruction, operands, memory, labels, memoryMapping) {
  const addToMemory = (value, type, asmOpcode = null, asmOperand = null) => {
    const address = memory.length;

    memory.push(value);
    memoryMapping.push({
      address,
      value: parseInt(value, 10),
      type,
      asmOpcode,
      asmOperand,
      label: labels[address],
    });
  };

  if (instruction === 'DATA') {
    operands.forEach((operand) => {
      addToMemory(parseValue(operand), 'data', null, operand);
    });
  } else if (opcodes[instruction] !== undefined) {
    addToMemory(opcodes[instruction], 'opcode', instruction);

    operands.forEach((operand) => {
      const operandValue = findKeyByValue(labels, operand) || parseValue(operand);
      addToMemory(operandValue, 'operand', null, operand);
    });
  } else if (instruction) {
    // Note: a valid line with a lable and no opCode will have an instruction == undefined.
    const formattedInstructionHex = formatHexByte(instruction);
    const formattedInstructionBinary = formatBinary(instruction, 8); // Assuming 8 bits for the instruction
    const formattedAddressHex = formatAddress(memory.length);
    const formattedAddressDecimal = memory.length;

    const errorMessage = `Invalid instruction [${formattedInstructionHex} | ${formattedInstructionBinary}] at address ${formattedAddressHex} (${formattedAddressDecimal})!`;
    throw new Error(errorMessage);
  }
}

/**
 * Compiles assembly code into a memory image.
 *
 * @param {string} assemblyTxt - The assembly code to compile.
 * @returns {number[]} - The resulting memory image.
 */
function compile(assemblyTxt) {
  const assemblyLines = assemblyTxt.split('\n')
    .map(removeComments)
    .filter((line) => line.trim().length > 0)
    .map(ensureSpaceAfterLabel);
  const memory = [];
  const memoryMapping = [];
  const labels = {};

  // First pass: Identify labels and their addresses
  let address = 0;
  assemblyLines.forEach((line) => {
    const [instruction, ...operands] = line.trim().split(/\s+|,\s*/);
    address = processLabel(instruction, operands, labels, address);
  });

  // Second pass: Compile instructions and resolve labels
  assemblyLines.forEach((line) => {
    let [instruction, ...operands] = line.trim().split(/\s+|,\s*/);

    if (isLabel(instruction)) {
      instruction = operands.shift(); // Adjust for the actual instruction after the label
    }

    processInstruction(instruction, operands, memory, labels, memoryMapping);
  });

  return [memory, labels, memoryMapping];
}

export default compile;
