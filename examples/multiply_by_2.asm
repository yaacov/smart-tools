; This program multiplies a number by 2 using a left shift operation

START:  LOADA NUM       ; Load the number into register A
        SHLA 1          ; Shift left by 1 position (equivalent to multiplying by 2)
        STOREA RESULT   ; Store the result

        END             ; End the program

NUM:    DATA 0x05       ; 5 in decimal
RESULT: DATA 0x00       ; Placeholder for the result
