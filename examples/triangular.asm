; This program calculates the fibonachi of a number

START:  LOADA NUM      ; Load the number into register A (initial value)
        LOADB NUM       ; Load the number into register B (to act as a counter)
LOOP:   JZB ENDLOOP     ; If A is zero, jump to end of loop

        ADDB NEGONE     ; Subtract 1 from B (counter)
        STOREB NUM      ; Add current NUM to A
        ADDA NUM        

        JUMP LOOP       ; Jump back to the start of the loop

ENDLOOP:STOREA RESULT   ; Store the result (triangular value)

        END             ; End the program

NUM:    DATA 0x05       ; 5 in
RESULT: DATA 0x00       ; Placeholder for the result

ONE:    DATA 0x01       ; 1 in decimal
NEGONE: DATA 0xFF       ; -1 in two's complement (for 8-bit)
