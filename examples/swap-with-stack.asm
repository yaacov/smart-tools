; Program to swap two numbers using the stack

; Init the stack pointer (base pointer)
SETBP STACK

; Push two numbers in order
PUSH NUM1
PUSH NUM2

; Pop the numbers out of order
POP NUM1
POP NUM2

; End program 
END

NUM1: DATA 0xF0
NUM2: DATA 0x0F

; start of stack memory
STACK:
