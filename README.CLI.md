# SMART CLI Tools

The SMART CLI toolset provides a suite of command-line utilities to work with the SMART Assembly Language. The toolset includes an assembler, a disassembler, and a virtual machine to run the compiled programs.

## Installation

To install the SMART CLI tools, you can use:

```bash
npm install <package-name>
```

## Tools

### 1. SMART Assembler

The assembler takes an assembly .asm file and compiles it into a binary .obj file.

#### Usage:

```bash

smart-assembler <input.asm> <output.obj> [--debug]
```

#### Options:

```
    --debug: Enable debug mode.
```

### 2. SMART Disassembler

The disassembler takes a binary .obj file and converts it back into an assembly .asm file.

#### Usage:

```bash

smart-disassemble <input.obj> [output.asm]
```

If output.asm is not provided or set to -, the output will be printed to stdout.

#### Options:

```
    --debug: Enable debug mode.
```

### 3. SMART VM

The virtual machine runs the compiled .obj programs.

#### Usage:

```bash

smart-vm <input.obj> [--debug]
```

#### Options:

```
    --debug (or -d): Run in debug mode.
```

### Help

Each tool provides a help option (-h or --help) that displays more detailed usage information.