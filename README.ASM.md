# SMART Assembly Language Tutorial

Welcome to the SMART Assembly Language tutorial! SMART stands for **Simple Machine Architecture & Runtime**. This assembly language is designed to be both simple and comprehensive, making it perfect for educational purposes. It provides a balanced approach to help students understand the foundational concepts of assembly programming without overwhelming them with intricate details.

In this guide, we'll introduce you to the basics of the SMART Assembly language, its opcodes, and how to write simple programs. Let's dive in!

## Table of Contents

- [Introduction](#introduction)
- [Opcodes](#opcodes)
- [Comments and Labels](#comments-and-labels)
- [Writing a Simple Program](#writing-a-simple-program)
- [Conclusion](#conclusion)

## Introduction

SMART Assembly is a simple assembly language designed for educational purposes. It provides a set of basic opcodes to perform arithmetic, logical, and control flow operations.

## Opcodes

Here's a list of available opcodes in the SMART Assembly language:

- `LOADA <label>`: Load the value from the memory location specified by `<label>` into register A.
- `LOADB <label>`: Load the value from the memory location specified by `<label>` into register B.
- `STOREA <label>`: Store the value from register A into the memory location specified by `<label>`.
- `STOREB <label>`: Store the value from register B into the memory location specified by `<label>`.
- `ADDA <label>`: Add the value from the memory location specified by `<label>` to register A.
- `ADDB <label>`: Add the value from the memory location specified by `<label>` to register B.
- `ORA <label>`: Perform a bitwise OR operation between register A and the value at `<label>`, storing the result in register A.
- `ORB <label>`: Perform a bitwise OR operation between register B and the value at `<label>`, storing the result in register B.
- `ANDA <label>`: Perform a bitwise AND operation between register A and the value at `<label>`, storing the result in register A.
- `ANDB <label>`: Perform a bitwise AND operation between register B and the value at `<label>`, storing the result in register B.
- `XORA <label>`: Perform a bitwise XOR operation between register A and the value at `<label>`, storing the result in register A.
- `XORB <label>`: Perform a bitwise XOR operation between register B and the value at `<label>`, storing the result in register B.
- `NOTA`: Perform a bitwise NOT operation on register A.
- `NOTB`: Perform a bitwise NOT operation on register B.
- `SHLA <value>`: Shift the bits in register A to the left by `<value>` positions.
- `SHLB <value>`: Shift the bits in register B to the left by `<value>` positions.
- `SHRA <value>`: Shift the bits in register A to the right by `<value>` positions.
- `SHRB <value>`: Shift the bits in register B to the right by `<value>` positions.
- `JUMP <label>`: Jump to the address specified by `<label>`.
- `JZA <label>`: Jump to the address specified by `<label>` if register A is zero.
- `JZB <label>`: Jump to the address specified by `<label>` if register B is zero.
- `END`: End the program execution.


## Comments and Labels

### Comments

In SMART Assembly, comments are denoted by a semicolon (`;`). Anything following a semicolon on a line is considered a comment and is ignored by the assembler.

Example:

```assembly
; This is a comment and will be ignored by the assembler
LOADA NUM1  ; This loads the value at NUM1 into register A
```

### Labels

Labels are used to mark specific locations in the code. They are followed by a colon (:) and can be used as operands for certain opcodes. Labels are especially useful for jumps and data storage.

Example:

```assembly

START:     ; This is a label named START
LOADA NUM1 ; Use the label NUM1 as an operand
```

## Writing a Simple Program

Let's write a simple program to add two numbers:

```assembly

; This program adds two numbers and stores the result

START:  LOADA NUM1       ; Load the first number into register A
        ADDA NUM2        ; Add the value at NUM2 to register A
        STOREA RESULT    ; Store the result

        END              ; End the program

NUM1:   DATA 0x05        ; 5 in decimal
NUM2:   DATA 0x03        ; 3 in decimal
RESULT: DATA 0x00        ; Placeholder for the result
```

In this program, we first load the first number into register A. We then add the second number to register A and store the result.

Foe more examples see [examples](./examples/).

## Conclusion

This tutorial introduced you to the basics of the SMART Assembly language, including its opcodes, comments, and labels. With this knowledge, you can start writing your own programs and exploring more advanced features of the language.