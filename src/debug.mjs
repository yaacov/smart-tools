import {
  formatHexByte, formatBinary, formatDecimal, formatAddress,
} from './utils.mjs';

/**
 * Dumps the labels and their addresses to the console.
 *
 * @param {Object} labels - An object where keys are label names and values are their addresses.
 */
export function dumpLabels(labels) {
  Object.entries(labels).forEach(([address, label]) => {
    console.log(`${label.padStart(8)}: 0x${address.toString(16).padStart(2, '0').toUpperCase()}`);
  });
}

/**
 * Dumps the current state of the CPU to the console.
 *
 * @param {number} registerA - The value of register A.
 * @param {number} registerB - The value of register B.
 * @param {number} pc - The program counter.
 */
export function dumpCPUState(registerA, registerB, pc) {
  console.log('---------------------------------------');
  console.log('   Register  | Dec | Hex  | Binary    ');
  console.log('---------------------------------------');

  const regA = {
    decimal: formatDecimal(registerA, 3),
    hex: formatHexByte(registerA),
    binary: formatBinary(registerA),
  };

  const regB = {
    decimal: formatDecimal(registerB, 3),
    hex: formatHexByte(registerB),
    binary: formatBinary(registerB),
  };

  console.log(`   registerA | ${regA.decimal} | ${regA.hex} | ${regA.binary}`);
  console.log(`   registerB | ${regB.decimal} | ${regB.hex} | ${regB.binary}`);
  console.log(`   pc        | ${formatDecimal(pc, 3)} | ${formatAddress(pc)} | ${formatBinary(pc)}`);

  console.log('---------------------------------------');
}

export function dumpMemoryMap(memoryMapping, ps = 0, memory = null) {
  console.log('-------------------------------------------------------------------------');
  console.log('| Label    | Addr   | Static | Volatile        | Opcode | Operand       |');
  console.log('-------------------------------------------------------------------------');

  memoryMapping.forEach((item) => {
    const label = (item.label || '').padEnd(8);
    const address = `0x${item.address.toString(16).padStart(2, '0')}`;
    const psIndicator = item.address === ps ? ' *' : '  ';
    const value = `0x${item.value.toString(16).padStart(2, '0').toUpperCase()}`;
    const volatileValue = memory ? memory[item.address] : item.value;
    const volatileHex = `0x${volatileValue.toString(16).padStart(2, '0').toUpperCase()}`;
    let volatileBinary = volatileValue.toString(2).padStart(8, '0');
    const opcode = (item.asmOpcode || '').padEnd(6);
    let operand = (item.asmOperand || '').padEnd(7);
    if (item.type === 'data') {
      operand += '(data)';
    } else {
      operand += '      ';
    }
    if (volatileValue !== item.value) {
      volatileBinary += ' *';
    } else {
      volatileBinary += '  ';
    }
    console.log(`| ${label} | ${address}${psIndicator} | ${value}   | ${volatileHex} ${volatileBinary} | ${opcode} | ${operand} |`);
  });

  console.log('-------------------------------------------------------------------------');
}
