## ¿Qué es la Validación de Tarjeta de Crédito?

La validación de tarjeta de crédito es un proceso para verificar si un número de tarjeta es potencialmente válido antes de procesar una transacción. Utiliza el algoritmo de Luhn y la identificación de marca de tarjeta para verificar el formato.

### Algoritmo de Luhn

El algoritmo de Luhn (también conocido como Mod 10) es una fórmula de suma de verificación utilizada para validar números de identificación. Así es como funciona:

1. Comenzando desde el dígito más a la derecha, duplica cada segundo dígito
2. Si duplicar resulta en un número mayor que 9, resta 9 del resultado
3. Suma todos los dígitos. Si el total es divisible por 10, el número es válido

### Marcas de Tarjetas Soportadas

Las marcas de tarjetas se identifican por su BIN (Número de Identificación Bancaria) o IIN (Número de Identificación del Emisor), que son los primeros dígitos del número de tarjeta.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
