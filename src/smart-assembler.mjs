#!/usr/bin/env node

import fs from 'fs';
import process from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import compile from './compiler.mjs';
import { dumpLabels, dumpMemoryMap } from './debug.mjs';

function main() {
  const { argv } = yargs(hideBin(process.argv))
    .usage('Usage: $0 <input.asm> <output.obj> [--debug]')
    .demandCommand(2) // Requires exactly two non-option arguments.
    .option('debug', {
      describe: 'Enable debug mode',
      type: 'boolean',
    })
    .help()
    .alias('help', 'h');

  const [inputPath, outputPath] = argv._; // Non-option arguments
  const { debug } = argv;

  // Read the assembly file
  fs.readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${inputPath}: ${err}`);
      process.exit(1);
    }

    // Compile the assembly code
    const [memory, labels, memoryMapping] = compile(data);

    if (debug) {
      console.log('Labels:');
      dumpLabels(labels);
      console.log();

      console.log('Memory:');
      dumpMemoryMap(memoryMapping, 0, null);
      console.log();
    }

    // Convert the memory image to a buffer
    const buffer = Buffer.from(memory);

    // Write the buffer to the output file
    fs.writeFile(outputPath, buffer, (err) => {
      if (err) {
        console.error(`Error writing to file ${outputPath}: ${err}`);
        process.exit(1);
      }

      console.log(`Compiled and written to ${outputPath}`);
    });

    // Convert the memory map to a JSON string
    const jsonMap = JSON.stringify({ labels, memoryMapping }, null, 2);

    // Write the JSON string to the output file
    fs.writeFile(`${outputPath}.map`, jsonMap, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file ${outputPath}.map: ${err}`);
        process.exit(1);
      }

      console.log(`Debug memory map written to ${outputPath}.map`);
    });
  });
}

main();
