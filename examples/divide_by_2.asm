; This program divides a number by 2 using a right shift operation

START:  LOADA NUM       ; Load the number into register A
        SHRA 1          ; Shift right by 1 position (equivalent to dividing by 2)
        STOREA RESULT   ; Store the result

        END             ; End the program

NUM:    DATA 0x04       ; 4 in decimal
RESULT: DATA 0x00       ; Placeholder for the result
