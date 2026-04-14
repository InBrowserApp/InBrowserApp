## What It Does

Decodifica el encabezado HTTP Basic Authorization para extraer usuario y contraseña desde Base64. Útil para depuración y pruebas de API.

## Accepted Input

Pega algo como: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
