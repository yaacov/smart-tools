; Program to calculate triangular revursively

; Init the stack pointer (base pointer)
SETBP STACK

; Call recursive triangular method
LOADA NUM1
PUSHA
CALL FUNC
POPA ; clear stack into regA

; Move result from register B to memory
STOREB RESULT

; End program 
END

NUM1:     DATA 0x06
RESULT:   DATA 0x00

ZERO:     DATA 0x00
MINUSONE: DATA 0xFF
TEMP:     DATA 0x00

; Recursive triangular
FUNC:
    ; Load arg to register A
    LOADA [BP + 1] ; [base pointer + 1] is the first function argument

    ; Add the arg to register B using TEMP
    STOREA TEMP
    ADDB TEMP

    ; Check for termination condition, arg == 0
    JZA RET

    ; Call recursively with (arg - 1) 
    ADDA MINUSONE
    PUSHA
    CALL FUNC
    POPA ; clear stack into regA
RET: RET

; Start of stack
STACK:
