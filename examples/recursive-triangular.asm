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
    ; Load argument to register A
    LOADA [BP + 1] ; [base pointer + 1] is the first function argument

    ; Load argument into TEMP
    STOREA TEMP

    ; Add the argument to register B
    ADDB TEMP

    ; Use register A to check for termination condition (arg == 0)
    JZA RET

    ; Put (arg - 1) in temp
    ADDA MINUSONE
    STOREA TEMP

    ; Call recursively with num - 1 
    PUSHA
    CALL FUNC
    POPA ; clear stack into regA
RET: RET

; Start of stack
STACK:
