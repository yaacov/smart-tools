; Program to swap two numbers using the stack

; Init the stack pointer (base pointer)
SETBP STACK

; Push two numbers in order
LOADA NUM1
PUSHA
LOADA NUM2
PUSHA


; Pop the numbers out of order
POPA
STOREA NUM1
POPA
STOREA NUM2

; End program 
END

NUM1: DATA 0xF0
NUM2: DATA 0x0F

; start of stack memory
STACK:
