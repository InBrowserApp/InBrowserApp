Convert whole numbers between binary, octal, decimal, hexadecimal, Base32, Base36, Base62, Base64, and custom bases from 2 to 64 directly in the browser. Everything runs locally with BigInt arithmetic, so you can inspect large values without sending them to a server.

## When to use it

Use this tool when the same integer appears in logs, protocols, IDs, or specs with different alphabets. Editing any field recalculates the others immediately, which is useful for debugging, documentation, and manual verification.

## Base differences

Bases up to 36 accept letters case-insensitively. Higher bases treat uppercase and lowercase letters as different digits, and the Base64 row uses the numeric alphabet `A-Z a-z 0-9 + /`, not byte-oriented Base64 text encoding.

## Things to watch

Only non-negative integers are supported. Leading zeroes are formatting, so converted outputs are normalized and may drop the padding from the value you typed.
