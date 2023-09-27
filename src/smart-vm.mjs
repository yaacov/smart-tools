#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

import fs from 'fs';
import process from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import VM from './vm.mjs';
import { waitForKeypress } from './utils.mjs';
import { dumpCPUState, dumpMemoryMap } from './debug.mjs';
import { disassemble } from './disassemble.mjs';

function main() {
  const { argv } = yargs(hideBin(process.argv))
    .usage('Usage: $0 <input.obj> [--debug] [--map <path-to-map-file>]')
    .command('$0 <input>', 'Run the program', (yargs) => {
      yargs.positional('input', {
        describe: 'Path to the input .obj file',
        type: 'string',
        demandOption: true,
      });
    })
    .option('map', {
      alias: 'm',
      type: 'string',
      description: 'Path to the debug symbol map file',
    })
    .option('debug', {
      alias: 'd',
      type: 'boolean',
      description: 'Run in debug mode',
    })
    .help()
    .alias('help', 'h');

  const inputPath = argv.input;
  const { debug } = argv;

  let memoryMapping;

  // Read the .obj file
  fs.readFile(inputPath, async (err, data) => {
    if (err) {
      console.error(`Error reading file ${inputPath}: ${err}`);
      process.exit(1);
    }

    // Convert the buffer to an array of numbers
    const program = Array.from(data);

    if (argv.map) {
      // Load memoryMapping from the provided map file
      try {
        const mapData = fs.readFileSync(argv.map, 'utf-8');
        const parsedData = JSON.parse(mapData);
        memoryMapping = parsedData.memoryMapping;

        if (!memoryMapping) {
          console.error('The provided map file does not contain a valid "memoryMapping" field.');
          process.exit(1);
        }
      } catch (err) {
        console.error(`Error reading or parsing the map file: ${err.message}`);
        process.exit(1);
      }
    } else {
      // Disassemble the program
      [memoryMapping] = disassemble(program);
    }

    // Load the program into the SMART computer and run it
    const vm = new VM();
    vm.loadProgram(program);

    console.log();
    console.log('Start program.');
    console.log('==============');
    console.log();

    // Dump the starting state of the registers
    dumpCPUState(vm.registerA, vm.registerB, vm.pc);
    console.log();

    console.log('Memory:');
    dumpMemoryMap(memoryMapping, vm.pc, vm.memory);
    console.log();

    if (debug) {
      try {
        while (true) {
          const executionResult = vm.execute();

          if (!executionResult) {
            break;
          }

          console.log();

          dumpCPUState(vm.registerA, vm.registerB, vm.pc);
          console.log();

          console.log('Memory:');
          dumpMemoryMap(memoryMapping, vm.pc, vm.memory);
          console.log();

          await waitForKeypress();
        }
      } catch (err) {
        if (err.message === 'CTRL+C detected') {
          process.exit(0); // Exit gracefully
        } else {
          throw err; // Rethrow if it's another error
        }
      }
    } else {
      vm.run();
    }

    console.log('\nExit opCode.\n');

    // Dump the final state of the registers
    dumpCPUState(vm.registerA, vm.registerB, vm.pc);
    console.log();

    console.log('Memory:');
    dumpMemoryMap(memoryMapping, vm.pc, vm.memory);
    console.log();

    console.log('End program.');
    console.log('============');
    console.log();
  });
}

main();
