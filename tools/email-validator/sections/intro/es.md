## ¿Qué es la validación de correo electrónico?

La validación de correo electrónico comprueba si una dirección sigue reglas sintácticas comunes para la parte local, el signo `@`, las etiquetas del dominio y el dominio de nivel superior. Sirve para probar formularios, limpiar datos de ejemplo y detectar errores tipográficos evidentes antes de enviar.

### Qué comprueba este validador

- Un solo `@` que separe la parte local y el dominio
- Límites de longitud para toda la dirección, la parte local y el dominio
- Caracteres permitidos, posición de los puntos, reglas de guiones y estructura del TLD
- Un resultado normalizado con el dominio en minúsculas para comparar mejor

### Ejemplos

- Válido: `name@example.com`
- Válido: `first.last+news@example.co.uk`
- No válido: `name..dots@example.com`
- No válido: `user@-example.com`

Los dominios internacionalizados deben introducirse en formato Punycode ASCII, por ejemplo `user@xn--bcher-kva.example`.

### Lo que esta herramienta no comprueba

- Si el buzón existe o puede recibir correo
- Comprobaciones de DNS, MX, SMTP o proveedores desechables
- Si un sitio web aceptará la dirección según sus propias reglas de negocio
