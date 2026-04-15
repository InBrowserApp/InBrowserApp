## ¿Qué es IBAN?

IBAN (International Bank Account Number) es un identificador estandarizado para cuentas bancarias usado en pagos internacionales.

### Estructura del IBAN

Un IBAN comienza con un código de país de dos letras, dos dígitos de control y un BBAN específico del país.

### Validación de checksum

La validez del IBAN se comprueba con el algoritmo mod-97 de la norma ISO 13616.

1. Elimine los espacios y mueva los primeros cuatro caracteres al final
2. Convierta las letras a números (A=10, B=11, ..., Z=35)
3. Calcule mod 97; un IBAN válido deja un resto de 1

Cada país define una longitud y estructura fija para la parte BBAN.
