; Program to calculate triangular revursively

; Init the stack pointer (base pointer)
SETBP STACK

; Call recursive triangular method
LOADA NUM1
PUSHA
CALL FUNC
POPA ; Get return value into regA

; Move result from register A to memory
STOREA RESULT

; End program 
END

NUM1:     DATA 0x06
RESULT:   DATA 0x00

ZERO:     DATA 0x00
MINUSONE: DATA 0xFF
TEMP:     DATA 0x00

; Recursive triangular
; f(n) = n + f(n-1)
FUNC:
    ; Load arg to register A
    LOADA [BP + 1] ; [base pointer + 1] is the first function argument

    ; Check for termination condition, arg == 0
    JZA RET

    ; Call recursively with (arg - 1) 
    ADDA MINUSONE
    PUSHA
    CALL FUNC
    POPA ; Get return value into regA

    ; Add the retrun value to arg:
    STOREA TEMP    ; TEMP = return value
    LOADA [BP + 1] ; regA = arg
    ADDA TEMP      ; regA + TEMP

    ; Store return value in arg
    STOREA [BP + 1]

RET: RET

; Start of stack
STACK:
