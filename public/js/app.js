/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import VM from './src/vm.mjs';
import compile from './src/compiler.mjs';

// Virtual machine
const memorySize = 256;
const vm = new VM(memorySize);
let runningStepTimeMs = 200;

let runningSteps = 0;
let runningInterval;

// Settings card components
const resetInputsSwitch = document.querySelector('#reset-inputs-switch');
const resetMachineSwitch = document.querySelector('#reset-machine-switch');
const addressSetArray = document.querySelector('#address-set-array');
const memorySetArray = document.querySelector('#memory-set-array');
const memorySetSwitch = document.querySelector('#memory-set-switch');

const addressValueElement = document.getElementById('address-value');
const memoryValueElement = document.getElementById('memory-value');
const memoryValueDecElement = document.getElementById('memory-value-dec');

// VM card components
const debugStepSwitch = document.querySelector('#debug-step-switch');
const runProgramSwitch = document.querySelector('#run-program-switch');
const registersTable = document.querySelector('#registers-table');
const resetPcSwitch = document.querySelector('#reset-pc-switch');
const turboSwitch = document.querySelector('#turbo-switch');
const memoryTable = document.querySelector('#memory-table');

// Editor card components
const codeEditor = document.querySelector('#code-editor');
const examplesTable = document.querySelector('#examples-table');
const opCodesTable = document.querySelector('#op-codes-table');
const compileButton = document.querySelector('#compile-button');
const loadFileComponent = document.querySelector('#load-file');
const saveFileComponent = document.querySelector('#save-file');

// Modal
const modal = document.getElementById('vmModal');

// Helper methods
function updateVmView() {
  registersTable.setAttribute('rega', vm.registerA);
  registersTable.setAttribute('regb', vm.registerB);
  registersTable.setAttribute('sp', vm.sp);
  registersTable.setAttribute('pc', vm.pc);

  memoryTable.memory = vm.memory;
  memoryTable.pc = vm.pc;
  memoryTable.sp = vm.sp;
}

// Main application
function app() {
  // Event Handlers
  function handleResetInputsSwitchValueChange(event) {
    addressSetArray.value = 0;
    memorySetArray.value = 0;
  }

  function handleResetPcSwitchValueChange(event) {
    vm.pc = 0;
    vm.sp = 0;

    updateVmView();
  }

  function handleTurboSwitchValueChange(event) {
    if (event.detail.value === 'false') {
      runningStepTimeMs = 200;
    } else {
      runningStepTimeMs = 20;
    }
  }

  function handleResetMachineSwitchValueChange(event) {
    vm.pc = 0;
    vm.sp = 0;
    vm.registerA = 0;
    vm.registerB = 0;
    vm.memory = new Array(memorySize).fill(0);

    const memoryMap = vm.memory.map((i) => ({ address: i, value: 0 }));

    updateVmView();
    memoryTable.memoryMap = memoryMap;
    memoryTable.labels = {};
  }

  function handleAddressSetArrayValueChange(event) {
    addressValueElement.textContent = `0x${addressSetArray.value.toString(16).toUpperCase().padStart(2, '0')}`;
  }

  function handleMemorySetArrayValueChange(event) {
    memoryValueElement.textContent = `0x${memorySetArray.value.toString(16).toUpperCase().padStart(2, '0')}`;
    memoryValueDecElement.textContent = memorySetArray.value;
  }

  function handleMemorySetSwitchValueChange(event) {
    vm.memory[addressSetArray.value] = memorySetArray.value;
    updateVmView();

    addressSetArray.value += 1;
    memorySetArray.value = 0;
  }

  function handleDebugStepSwitchValueChange(event) {
    try {
      vm.execute();

      updateVmView();
    } catch (error) {
      modal.open('Error excuting command', error, 'error');
    }
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
  }

  function handleCompileButtonClick(event) {
    try {
      vm.memory = new Array(memorySize).fill(0);
      vm.pc = 0;
      vm.sp = 0;
      vm.registerA = 0;
      vm.registerB = 0;

      const [memory, labels, memoryMap] = compile(codeEditor.code);

      if (memory.some(isNaN)) {
        const errorMessage = 'Compilation faile on unknown command';
        throw new Error(errorMessage);
      }

      vm.loadProgram(memory);

      updateVmView();
      memoryTable.memoryMap = memoryMap;
      memoryTable.labels = labels;
    } catch (error) {
      modal.open('Error compiiling code', error, 'error');
    }
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
      saveFileComponent.filename = event.detail.value;
    } catch (error) {
      modal.open('Error fetching example code', error, 'error');
    }
  }

  function handleOpCodesTableClick(event) {
    memorySetArray.value = event.detail.value;
  }

  function handleMemoryTableClick(event) {
    const address = event.detail.value;

    addressSetArray.value = address;
    memorySetArray.value = vm.memory[address];
  }

  function handleLoadFileFinished(event) {
    codeEditor.code = event.detail.text;
    saveFileComponent.filename = event.detail.filename;
  }

  // Event Listeners
  runProgramSwitch.addEventListener('valueChange', handleRunProgramSwitchValueChange);
  resetInputsSwitch.addEventListener('valueChange', handleResetInputsSwitchValueChange);
  resetPcSwitch.addEventListener('valueChange', handleResetPcSwitchValueChange);
  turboSwitch.addEventListener('valueChange', handleTurboSwitchValueChange);
  resetMachineSwitch.addEventListener('valueChange', handleResetMachineSwitchValueChange);
  addressSetArray.addEventListener('valueChange', handleAddressSetArrayValueChange);
  memorySetArray.addEventListener('valueChange', handleMemorySetArrayValueChange);
  memorySetSwitch.addEventListener('valueChange', handleMemorySetSwitchValueChange);
  debugStepSwitch.addEventListener('valueChange', handleDebugStepSwitchValueChange);
  examplesTable.addEventListener('tableClick', handleExamplesTableClick);
  opCodesTable.addEventListener('tableClick', handleOpCodesTableClick);
  memoryTable.addEventListener('tableClick', handleMemoryTableClick);
  compileButton.addEventListener('click', handleCompileButtonClick);
  loadFileComponent.addEventListener('uploadFinished', handleLoadFileFinished);

  // Updare the virtual machine registers and memory tables
  updateVmView();

  // Init editor with insperational quate
  codeEditor.code = '; your code here\n\n'
    + '; Select one of the examples on the right,\n'
    + '; or craft your own awesome code.\n\n'
    + '; for more information:\n'
    + ';    https://github.com/yaacov/smart-tools/blob/main/README.ASM.md\n';
}

// Start app
document.addEventListener('DOMContentLoaded', app);
