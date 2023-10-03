; Program to calculate factorial revursively

; Init the stack pointer (base pointer)
SETBP STACK

; Call recursive factorial method
PUSH NUM1
CALL FUNC
POP TEMP ; clear stack

; Move result from register B to memory
STOREB RESULT

; End program 
END

NUM1:     DATA 0x06
RESULT:   DATA 0x00

ZERO:     DATA 0x00
MINUSONE: DATA 0xFF
TEMP:     DATA 0x00

; Recursive factorial
FUNC:
    ; Load argument to register A
    LOADA [BP + 1] ; [base pointer + 1] is the first function argument

    ; Add the number to register B
    STOREA TEMP
    ADDB TEMP

    ; Use register A to check for termination condition (arg == 0)
    JZA RET

    ; Put (arg - 1) in temp
    ADDA MINUSONE
    STOREA TEMP

    ; Call recursively with num - 1 
    PUSH TEMP
    CALL FUNC
    POP  TEMP ; clear stack
RET: RET

; Start of stack
STACK:
