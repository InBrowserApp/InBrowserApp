## Qué hace

Decodifica el encabezado HTTP Basic Authorization para extraer usuario y contraseña desde Base64. Útil para depuración y pruebas de API.

## Entradas aceptadas

Pega algo como: Basic dXNlcjpwYXNz
Esta herramienta también acepta una línea completa `Authorization: Basic ...`.

## Notas

- Base64 solo codifica las credenciales; no las protege.
- El decodificador divide el contenido en el primer `:` y conserva el resto en la contraseña.
- Todo se ejecuta localmente en tu navegador.
