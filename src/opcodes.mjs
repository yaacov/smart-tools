/*
Instruction Format: -NNN -TTR

R (Bit 0):
    0: Register A (regA)
    1: Register B (RegB)

TT (Bits 1,2) - Opcode Type:
    00: Store operations
    01: Arithmetic operations (result saved in register)
    10: Jump operations (sets program counter)
    11: Stack operations

- (Bit 3): Reserved bit (always set to 0)

NNN (Bits 4,5,6) - Operation, depending on TT:
    Store:
        000: Store to memory
    Arithmetic:
        000: Pass-through (reg = memory)
        001: OR (reg OR memory)
        010: AND (reg AND memory)
        011: XOR (reg XOR memory)
        100: NOT (NOT reg)
        101: Shift Left
        110: Shift Right
        111: Add (reg + memory)
    Jump:
        001: Unconditional Jump
        010: Conditional Jump (if register == 0)
    Stack:
        001: Set base pointer
        010: Push to stack
        011: Pop from stack
        100: Call function
        101: Return from function
        110: Load (base pointer + address) to regA
        111: Store regA to (base pointer + address)

- (Bit 7): Reserved bit (always set to 0)
*/
export const opcodes = {
  NOP: 0x00,
  END: 0xFF,

  STOREA: 0x10, // Store to memory with regA
  STOREB: 0x11, // Store to memory with regB

  LOADA: 0x20, // Pass-through with regA
  LOADB: 0x21, // Pass-through with regB
  ORA: 0x22, // OR with regA
  ORB: 0x23, // OR with regB
  ANDA: 0x24, // AND with regA
  ANDB: 0x25, // AND with regB
  XORA: 0x26, // XOR with regA
  XORB: 0x27, // XOR with regB
  NOTA: 0x28, // NOT with regA
  NOTB: 0x29, // NOT with regB
  SHLA: 0x2A, // Shift Left with regA
  SHLB: 0x2B, // Shift Left with regB
  SHRA: 0x2C, // Shift Right with regA
  SHRB: 0x2D, // Shift Right with regB
  ADDA: 0x2E, // Add with regA
  ADDB: 0x2F, // Add with regB

  JUMP: 0x41, // Unconditional Jump
  JZA: 0x42, // Conditional Jump if regA == 0
  JZB: 0x43, // Conditional Jump if regB == 0

  SETBP: 0x51, // Set base pointer
  PUSH: 0x52, // Push to stack
  POP: 0x53, // Pop from stack
  CALL: 0x54, // Call function
  RET: 0x55, // Return from function
  LOADABP: 0x56, // Load (base pointer + address) to regA
  STOREABP: 0x57, // Store regA to (base pointer + address)
};

// Params list length can be 0 or 1,
// in case of 0 params [NOP, NOTA, NOTB, RET, END] the compiler will pad the
// memory with a 0, to align with [opcode, data] pairs.
export const opcodesParams = {
  [opcodes.NOP]: 0,
  [opcodes.END]: 0,
  [opcodes.STOREA]: 1,
  [opcodes.STOREB]: 1,
  [opcodes.LOADA]: 1,
  [opcodes.LOADB]: 1,
  [opcodes.ORA]: 1,
  [opcodes.ORB]: 1,
  [opcodes.ANDA]: 1,
  [opcodes.ANDB]: 1,
  [opcodes.XORA]: 1,
  [opcodes.XORB]: 1,
  [opcodes.NOTA]: 0,
  [opcodes.NOTB]: 0,
  [opcodes.SHLA]: 1,
  [opcodes.SHLB]: 1,
  [opcodes.SHRA]: 1,
  [opcodes.SHRB]: 1,
  [opcodes.ADDA]: 1,
  [opcodes.ADDB]: 1,
  [opcodes.JUMP]: 1,
  [opcodes.JZA]: 1,
  [opcodes.JZB]: 1,
  [opcodes.SETBP]: 1,
  [opcodes.PUSH]: 1,
  [opcodes.POP]: 1,
  [opcodes.CALL]: 1,
  [opcodes.RET]: 0,
  [opcodes.LOADABP]: 1,
  [opcodes.STOREABP]: 1,
};

export default opcodes;
