/*
Instruction Format: -NNN TT-R

R (Bit 0):
    0: Register A (regA)
    1: Register B (RegB)

- (Bit 1): Reserved bit (always set to 0)

TT (Bits 2,3) - Opcode Type:
    00: Store to memory operations
    01: Arithmetic operations (result saved in register)
    10: Jump operations (sets program counter)
    11: Stack operations (pop and push to stack)

NNN (Bits 4,5,6) - Operation, depending on TT:
    Store:
        000: reserved - NOP
        001: Store to memory
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
        000: Unconditional Jump
        001: Conditional Jump (if register == 0)
    Stack:
        000: Set base pointer
        001: Push to stack
        010: Pop from stack
        011: Call function
        100: Return from function
        101: Load (base pointer + address) to regA
        110: Store regA to (base pointer + address)

- (Bit 7): Reserved bit (always set to 0)
*/
export const opcodes = {
  NOP: 0x00,
  END: 0xFF,

  STOREA: 0x10, //   0001 00 00 - Store to memory with regA
  STOREB: 0x11, //   0001 00 01 - Store to memory with regB

  LOADA: 0x04, //    0000 01 00 - Pass-through with regA
  LOADB: 0x05, //    0000 01 01 - Pass-through with regB
  ORA: 0x14, //      0001 01 00 - OR with regA
  ORB: 0x15, //      0001 01 01 - OR with regB
  ANDA: 0x24, //     0010 01 00 - AND with regA
  ANDB: 0x25, //     0010 01 01 - AND with regB
  XORA: 0x34, //     0011 01 00 - XOR with regA
  XORB: 0x35, //     0011 01 01 - XOR with regB
  NOTA: 0x44, //     0100 01 00 - NOT with regA
  NOTB: 0x45, //     0100 01 01 - NOT with regB
  SHLA: 0x54, //     0101 01 00 - Shift Left with regA
  SHLB: 0x55, //     0101 01 01 - Shift Left with regB
  SHRA: 0x64, //     0110 01 00 - Shift Right with regA
  SHRB: 0x65, //     0110 01 01 - Shift Right with regB
  ADDA: 0x74, //     0111 01 00 - Add with regA
  ADDB: 0x75, //     0111 01 01 - Add with regB

  JUMP: 0x08, //     0000 10 00 - Unconditional Jump
  JZA: 0x18, //      0001 10 00 - Conditional Jump if regA == 0
  JZB: 0x19, //      0001 10 01 - Conditional Jump if regB == 0

  SETBP: 0x0C, //    0000 11 00 - Set base pointer
  PUSHA: 0x1C, //    0001 11 00 - Push to stack
  POPA: 0x2C, //     0010 11 00 - Pop from stack
  CALL: 0x3C, //     0011 11 00 - Call function
  RET: 0x4C, //      0100 11 00 - Return from function
  LOADABP: 0x5C, //  0101 11 00 - Load (base pointer + address) to regA
  STOREABP: 0x6C, // 0110 11 00 - Store regA to (base pointer + address)
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
  [opcodes.PUSHA]: 0,
  [opcodes.POPA]: 0,
  [opcodes.CALL]: 1,
  [opcodes.RET]: 0,
  [opcodes.LOADABP]: 1,
  [opcodes.STOREABP]: 1,
};

export default opcodes;
