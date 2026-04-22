## What It Does

Decodifique o cabeçalho HTTP Basic Authorization para extrair nome de usuário e senha do Base64. Útil para depuração e testes de API.

## Accepted Input

Cole algo como: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
