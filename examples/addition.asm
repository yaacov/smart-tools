; Initialize registers and memory
START:  LOADA NUM1       ; Load the first number into register A
        STOREA CARRY     ; Initialize CARRY with 0

; Bitwise addition loop
LOOP:   
        ; Calculate sum without carry
        LOADA NUM1
        XORA NUM2
        STOREA SUM

        ; Calculate carry
        LOADA NUM1
        ANDA NUM2
        SHLA 1          ; Shift left to get the carry for the next bit
        STOREA CARRY

        ; Update NUM1 with the sum and NUM2 with the carry for the next iteration
        LOADA SUM
        STOREA NUM1
        LOADA CARRY
        STOREA NUM2

        ; Check if there's any carry left
        LOADA CARRY
        JZA END        ; If there's no carry, end the program

        JUMP LOOP     ; Otherwise, continue the loop

END:    
        LOADA SUM
        STOREA RESULT   ; Store the final result

        END

NUM1:   DATA 0x05  ; 5 in decimal
NUM2:   DATA 0x03  ; 3 in decimal
RESULT: DATA 0x00
CARRY:  DATA 0x00
SUM:    DATA 0x00
