#!/usr/bin/env node

import fs from 'fs';
import process from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { disassemble, mappingToAsm } from './disassemble.mjs';
import { dumpMemoryMap, dumpLabels } from './debug.mjs';

function main() {
  const { argv } = yargs(hideBin(process.argv))
    .usage('Usage: $0 <input.obj> [output.asm]')
    .command('$0 <input> [output]', 'Disassemble the program', (yargs) => {
      yargs
        .positional('input', {
          describe: 'Path to the input .obj file',
          type: 'string',
          demandOption: true,
        })
        .positional('output', {
          describe: 'Path to the output .asm file or - for stdout',
          type: 'string',
          default: '-',
        });
    })
    .option('debug', {
      describe: 'Enable debug mode',
      type: 'boolean',
    })
    .help()
    .alias('help', 'h');

  const inputPath = argv.input;
  const outputPath = argv.output;
  const { debug } = argv;

  // Read the .obj file
  fs.readFile(inputPath, (err, data) => {
    if (err) {
      console.error(`Error reading file ${inputPath}: ${err}`);
      process.exit(1);
    }

    // Convert the buffer to an array of numbers
    const memory = Array.from(data);

    // Disassemble the memory
    const [memoryMapping, labels] = disassemble(memory);

    if (debug) {
      console.log('Labels:');
      dumpLabels(labels);
      console.log();

      console.log('Memory:');
      dumpMemoryMap(memoryMapping, 0, null);
      console.log();
    }

    // Convert the memory mapping to assembly
    const asmCode = mappingToAsm(memoryMapping);

    // Output the assembly code
    if (outputPath === '-') {
      console.log(asmCode);
    } else {
      fs.writeFile(outputPath, asmCode, (err) => {
        if (err) {
          console.error(`Error writing to file ${outputPath}: ${err}`);
          process.exit(1);
        }
        console.log(`Disassembled and written to ${outputPath}`);
      });
    }
  });
}

main();
