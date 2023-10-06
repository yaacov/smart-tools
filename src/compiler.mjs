import { opcodes, opcodesParams } from './opcodes.mjs';
import { findKeyByValue } from './utils.mjs';
import { throwFormattedError } from './debug.mjs';

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
 * Converts all characters in a string to uppercase,
 * except for 'x' characters in '0x...' hexadecimal number sequences.
 *
 * @param {string} line - The string to be converted.
 * @returns {string} The converted string.
 */
function codeToUpper(line) {
  return line.replace(/(0x[\da-fA-F]+)|./g, (match, p1) => {
    if (p1) {
      return p1; // return the hexadecimal number unchanged
    }
    return match.toUpperCase(); // uppercase other characters
  });
}

/**
 * Replaces instances of "STOREA [BP + <number>]" with "STOREABP <number>"
 * and "LOADA [BP + <number>]" with "LOADABP <number>" in a given line.
 *
 * @param {string} line - The input line of text.
 * @returns {string} - The modified line of text with the desired replacements.
 */
function replaceSyntax(line) {
  // The regex pattern for STOREA transformation
  const storeaPattern = /STOREA\s*\[\s*BP\s*\+\s*(\d+)\s*\]/g;
  const storeaReplacement = 'STOREABP $1';
  const modifiedStoreaLine = line.replace(storeaPattern, storeaReplacement);

  // The regex pattern for LOADA transformation
  const loadaPattern = /LOADA\s*\[\s*BP\s*\+\s*(\d+)\s*\]/g;
  const loadaReplacement = 'LOADABP $1';
  const modifiedLine = modifiedStoreaLine.replace(loadaPattern, loadaReplacement);

  return modifiedLine;
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
    address += 1; // +1 = one data entry
  }
  if (instruction in opcodes) {
    address += 2; // +2 = opcode + operand
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
    const valueInt = parseInt(value, 10);

    memory.push(valueInt);
    memoryMapping.push({
      address,
      value: valueInt,
      type,
      asmOpcode,
      asmOperand,
      label: labels[address],
    });
  };

  if (instruction === 'DATA') {
    if (operands.length !== 1) {
      throwFormattedError('Wrong number of data operands', instruction, memory.length);
    }

    const operand = operands[0];
    addToMemory(parseValue(operand), 'data', null, operand);

    return;
  }

  if (instruction in opcodes) {
    addToMemory(opcodes[instruction], 'opcode', instruction);

    if (operands.length !== opcodesParams[opcodes[instruction]]) {
      throwFormattedError('Wrong number of opcode operands', instruction, memory.length);
    }

    // In case of a command with no params, add a placeholder to align with [opcode, data] pairs
    if (operands.length === 0) {
      addToMemory(0, '', undefined);
    } else {
      const operand = operands[0];
      const operandValue = findKeyByValue(labels, operand) || parseValue(operand);
      addToMemory(operandValue, 'operand', null, operand);
    }

    return;
  }

  // Note: a valid line with a lable and no opCode will have an instruction == undefined.
  if (instruction !== undefined) {
    throwFormattedError('Invalid instruction', instruction, memory.length);
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
    .filter((line) => line.length > 0)
    .map(codeToUpper)
    .map(replaceSyntax)
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
