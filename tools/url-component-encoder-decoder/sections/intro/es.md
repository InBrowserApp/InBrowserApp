## ¿Qué es la codificación URL?

La codificación URL (también llamada codificación por porcentajes) es un método para convertir caracteres especiales en un formato que se puede transmitir de forma segura por internet. Las URL solo pueden contener ciertos caracteres, por lo que cualquier carácter que no esté permitido debe codificarse.

**Cómo funciona:**

- Los caracteres especiales se convierten a `%` seguido de su código ASCII hexadecimal
- Ejemplo: un espacio se convierte en `%20`, `{'@'}` se convierte en `%40`
- Solo las letras (A-Z, a-z), números (0-9) y algunos símbolos (- \_ . ~) no necesitan codificación

**Ejemplos comunes:**

- Espacio → `%20`
- `{'@'}` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Por qué es necesario:**

- Las URL tienen caracteres reservados con significados especiales
- Asegura que los datos se transmitan correctamente
- Previene conflictos con la estructura de la URL
- Requerido para formularios web y llamadas a API
