; This program performs a bitwise NOT operation on a number

START:  LOADA NUM       ; Load the number into register A
        NOTA            ; Perform NOT operation on register A
        STOREA RESULT   ; Store the result

        END             ; End the program

NUM:    DATA 0x03       ; 3 in decimal (binary: 0011)
RESULT: DATA 0x00       ; Placeholder for the result (expected: 1100)
