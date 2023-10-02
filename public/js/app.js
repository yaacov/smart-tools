/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import VM from './src/vm.mjs';
import { disassemble } from './src/disassemble.mjs';
import compile from './src/compiler.mjs';

// Virtual machine
const memorySize = 154;
const vm = new VM(memorySize);
const runningStepTimeMs = 50;

let runningSteps = 0;
let runningInterval;

let [memoryMapping] = disassemble(vm.memory);

// Settings card components
const resetInputsSwitch = document.querySelector('#reset-inputs-switch');
const resetMachineSwitch = document.querySelector('#reset-machine-switch');
const addressSetArray = document.querySelector('#address-set-array');
const memorySetArray = document.querySelector('#memory-set-array');
const memorySetSwitch = document.querySelector('#memory-set-switch');

const addressValueElement = document.getElementById('address-value');
const memoryValueElement = document.getElementById('memory-value');

// VM card components
const debugStepSwitch = document.querySelector('#debug-step-switch');
const runProgramSwitch = document.querySelector('#run-program-switch');
const registersTable = document.querySelector('#registers-table');
const resetPcSwitch = document.querySelector('#reset-pc-switch');
const memoryTable = document.querySelector('#memory-table');

// Editor card components
const codeEditor = document.querySelector('#code-editor');
const compileSwitch = document.querySelector('#compile-switch');
const examplesTable = document.querySelector('#examples-table');
const opCodesTable = document.querySelector('#op-codes-table');

// Modal
const modal = document.getElementById('vmModal');

// Helper methods
function updateVmView() {
  let data = [];
  for (let i = 0; i < memorySize; i++) {
    const mapping = i < memoryMapping.length ? memoryMapping[i] : undefined;

    data.push({
      address: i,
      indicator: vm.pc === i,
      value: vm.memory[i],
      label: mapping ? mapping.label : undefined,
      opCode: mapping ? mapping.asmOpcode : undefined,
      oprand: mapping ? mapping.asmOperand : undefined,
    });
  }

  registersTable.setAttribute('rega', vm.registerA);
  registersTable.setAttribute('regb', vm.registerB);

  memoryTable.setAttribute('data', JSON.stringify(data));
}

// Main application
function app() {
  // Event Handlers
  function handleResetInputsSwitchValueChange(event) {
    addressSetArray.value = 0;
    memorySetArray.value = 0;

    console.log(`resetInputsSwitch, value: ${event.detail.value}`);
  }

  function handleResetPcSwitchValueChange(event) {
    vm.pc = 0;

    updateVmView();

    console.log(`resetPcSwitch, value: ${event.detail.value}`);
  }

  function handleResetMachineSwitchValueChange(event) {
    vm.pc = 0;
    vm.registerA = 0;
    vm.registerB = 0;
    vm.memory = new Array(memorySize).fill(0);

    updateVmView();

    console.log(`resetMachineSwitch, value: ${event.detail.value}`);
  }

  function handleAddressSetArrayValueChange(event) {
    addressValueElement.textContent = `0x${addressSetArray.value.toString(16).padStart(2, '0')}`;

    console.log(`addressSetArray, value: ${event.detail.value}`);
  }

  function handleMemorySetArrayValueChange(event) {
    memoryValueElement.textContent = `0x${memorySetArray.value.toString(16).padStart(2, '0')}`;

    console.log(`memorySetArray, value: ${event.detail.value}`);
  }

  function handleMemorySetSwitchValueChange(event) {
    vm.memory[addressSetArray.value] = memorySetArray.value;
    updateVmView();

    addressSetArray.value += 1;
    memorySetArray.value = 0;

    console.log(`memorySetSwitch, value: ${event.detail.value}`);
  }

  function handleDebugStepSwitchValueChange(event) {
    try {
      vm.execute();

      updateVmView();
    } catch (error) {
      modal.open('Error excuting command', error, 'error');
    }

    console.log(`debugStepSwitch, value: ${event.detail.value}`);
  }

  function handleRunProgramSwitchValueChange(event) {
    if (event.detail.value === 'false') {
      clearInterval(runningInterval);
      runningSteps = 0;

      return;
    }

    if (runningInterval !== undefined || runningSteps > 0) {
      return;
    }

    try {
      runningSteps = 1000;
      let runningInterval = setInterval(() => {
        if (vm.execute() && vm.pc < vm.memory.length && runningSteps > 0) {
          updateVmView();

          runningSteps--;
        } else {
          clearInterval(runningInterval);
          runningSteps = 0;

          runProgramSwitch.value = 'false';
        }
      }, runningStepTimeMs);
    } catch (error) {
      modal.open('Error running program', error, 'error');
    }

    console.log(`runProgramSwitch, value: ${event.detail.value}`);
  }

  function handleCompileSwitchValueChange(event) {
    try {
      vm.memory = new Array(memorySize).fill(0);
      vm.pc = 0;
      vm.registerA = 0;
      vm.registerB = 0;

      const [memory, _, mapping] = compile(codeEditor.code);

      if (memory.some(isNaN)) {
        const errorMessage = 'Compilation faile on unknown command';
        throw new Error(errorMessage);
      }

      memoryMapping = mapping;
      vm.loadProgram(memory);

      updateVmView();
    } catch (error) {
      modal.open('Error compiiling code', error, 'error');
    }

    console.log(`compileSwitch, value: ${event.detail.value}`);
  }

  async function handleExamplesTableClick(event) {
    // Construct the URL to the file
    const fileUrl = `./js/examples/${event.detail.value}`;

    try {
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }

      // Get the file text
      const fileText = await response.text();

      codeEditor.code = fileText;
    } catch (error) {
      modal.open('Error fetching example code', error, 'error');
    }

    console.log(`examplesTable, value: ${event.detail.value}`);
  }

  function handleOpCodesTableClick(event) {
    memorySetArray.value = event.detail.value;

    console.log(`opCodesTable, value: ${event.detail.value}`);
  }

  function handleMemoryTableClick(event) {
    memorySetArray.value = event.detail.value;

    console.log(`memoryTable, value: ${event.detail.value}`);
  }

  // Event Listeners
  runProgramSwitch.addEventListener('valueChange', handleRunProgramSwitchValueChange);
  resetInputsSwitch.addEventListener('valueChange', handleResetInputsSwitchValueChange);
  resetPcSwitch.addEventListener('valueChange', handleResetPcSwitchValueChange);
  resetMachineSwitch.addEventListener('valueChange', handleResetMachineSwitchValueChange);
  addressSetArray.addEventListener('valueChange', handleAddressSetArrayValueChange);
  memorySetArray.addEventListener('valueChange', handleMemorySetArrayValueChange);
  memorySetSwitch.addEventListener('valueChange', handleMemorySetSwitchValueChange);
  debugStepSwitch.addEventListener('valueChange', handleDebugStepSwitchValueChange);
  compileSwitch.addEventListener('valueChange', handleCompileSwitchValueChange);
  examplesTable.addEventListener('tableClick', handleExamplesTableClick);
  opCodesTable.addEventListener('tableClick', handleOpCodesTableClick);
  memoryTable.addEventListener('tableClick', handleMemoryTableClick);

  // Updare the virtual machine registers and memory tables
  updateVmView();

  // Init editor with insperational quate
  codeEditor.code = '; your code here';
  resetMachineSwitch.value = 'true';
  resetInputsSwitch.value = 'true';
}

// Start app
document.addEventListener('DOMContentLoaded', app);
