; This program calculates the factorial of a number

START:  LOADA NUM       ; Load the number into register A (initial value)
        LOADB NUM       ; Load the number into register B (to act as a counter)
LOOP:   JZB ENDLOOP     ; If A is zero, jump to end of loop

        ADDB NEGONE     ; Subtract 1 from B (counter)
        STOREB NUM      ; Add current NUM to A
        ADDA NUM        

        JUMPB LOOP      ; Jump back to the start of the loop using B as the counter

ENDLOOP:STOREA RESULT   ; Store the result (factorial value)

        END             ; End the program

NUM:    DATA 0x05       ; 5 in decimal
ONE:    DATA 0x01       ; 1 in decimal
NEGONE: DATA 0xFF       ; -1 in two's complement (for 8-bit)
RESULT: DATA 0x00       ; Placeholder for the result