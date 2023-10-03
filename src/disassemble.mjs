import { opcodes } from './opcodes.mjs';
import { findKeyByValue } from './utils.mjs';

/**
 * Fills in the missing labels in the memory mapping based on the provided labels.
 *
 * @param {Array} memoryMapping - An array of memory mapping objects. Each object should have an 'address' property.
 * @param {Object} labels - An object where keys are label names and values are their addresses.
 * @returns {Array} An updated array of memory mapping objects with missing labels filled in.
 */
function fillLabels(memoryMapping, labels) {
  return memoryMapping.map((item) => {
    const label = labels[item.address];
    if (label) {
      return { ...item, label };
    }
    return item;
  });
}

/**
 * Disassembles a given memory array into its corresponding assembly representation.
 *
 * @param {Array<number>} memory - An array of numbers representing the memory content to be disassembled.
 * @returns {Array<Object>} An array of memory mapping objects.
 *   Each object will have properties like 'address', 'type', 'asmOpcode', 'asmOperand', and 'label'.
 */
export function disassemble(memory) {
  let address = 0;
  let labelDatIndex = 0;
  let labelJumIndex = 0;
  let progEnd = false;
  const labels = {};
  const memoryMapping = new Array(memory.length).fill(null);

  while (address < memory.length) {
    const opcodeValue = memory[address];
    const opcodeName = findKeyByValue(opcodes, opcodeValue);

    // assume it's an opCode or Data
    if (!opcodeName || progEnd) {
      memoryMapping[address] = {
        address,
        value: memory[address],
        type: 'data',
        asmOpcode: 'DATA',
        asmOperand: null,
        label: labels[address] || null,
      };
      address++;
    } else {
      let opAddress = address;
      let operandValue = null;
      let asmOperand = null;

      switch (opcodeName) {
        case 'LOADA':
        case 'LOADB':
        case 'STOREA':
        case 'STOREB':
        case 'ANDA':
        case 'ANDB':
        case 'XORA':
        case 'XORB':
        case 'ADDA':
        case 'ADDB':
        case 'PUSH':
        case 'POP':
        case 'CALL':
        case 'SETBP':
        case 'LOADABP':
        case 'STOREABP':
          operandValue = memory[++address];
          if (!labels[operandValue]) {
            labels[operandValue] = `DAT${labelDatIndex++}`;
          }
          asmOperand = labels[operandValue];
          break;
        case 'JUMP':
        case 'JZA':
        case 'JZB':
          operandValue = memory[++address];
          if (!labels[operandValue]) {
            labels[operandValue] = `JMP${labelJumIndex++}`;
          }
          asmOperand = labels[operandValue];
          break;
        case 'SHLA':
        case 'SHLB':
          operandValue = memory[++address];
          asmOperand = operandValue.toString(); // Directly use the integer value for shifts
          break;
        case 'ORA':
        case 'ORB':
        case 'NOP':
        case 'RET':
          // obCodes with no operands
          break;
        case 'END':
          progEnd = true;
          break;
        default:
          console.error(`Unhandled opcode: ${opcodeName}`);
          break;
      }

      memoryMapping[opAddress] = {
        address: opAddress,
        value: opcodeValue,
        type: 'opcode',
        asmOpcode: opcodeName,
        asmOperand: null,
        label: null,
      };

      // Assume max of 1 operand per opCode
      if (operandValue !== null) {
        memoryMapping[address] = {
          address,
          value: operandValue,
          type: 'operand',
          asmOpcode: null,
          asmOperand,
          label: null,
        };
      }

      address++;
    }
  }

  const memoryMappingWithLabels = fillLabels(memoryMapping, labels);

  return [memoryMappingWithLabels, labels];
}

/**
 * Converts a memory mapping to its corresponding assembly (asm) representation.
 *
 * @param {Array} memoryMapping - An array of memory mapping objects.
 *   Each object should have properties like 'address', 'type', 'asmOpcode', 'asmOperand', and 'label'.
 * @param {string} [comment=''] - An optional comment string to prepend to the assembly output.
 * @returns {string} The assembly representation of the provided memory mapping.
 */
export function mappingToAsm(memoryMapping, comment = '') {
  let asmString = '';

  for (let i = 0; i < memoryMapping.length; i++) {
    const item = memoryMapping[i];

    if (item.label) {
      asmString += `${item.label}:`.padEnd(8);
    } else {
      asmString += ''.padEnd(8);
    }

    if (item.type === 'opcode') {
      asmString += `${item.asmOpcode}`;
      if (memoryMapping[i + 1] && memoryMapping[i + 1].type === 'operand') {
        asmString += ` ${memoryMapping[i + 1].asmOperand}`;
        i++; // Skip the next item since it's an operand we've just processed
      }
      asmString += '\n';
    } else if (item.type === 'data') {
      asmString += `DATA ${item.value}\n`;
    }
  }

  return comment ? `${comment}\n${asmString}` : asmString;
}

export default disassemble;
