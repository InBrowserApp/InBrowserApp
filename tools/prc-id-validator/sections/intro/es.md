## ¿Qué es un ID de residente de la RPC?

El número de ID de residente de la RPC tiene 18 caracteres e incluye código de dirección, fecha de nacimiento, código de secuencia y dígito de control. Este validador revisa esas partes sin conexión y te ayuda a entender cómo está estructurado el número.

### Cómo funciona la validación

- Elimina espacios y guiones y normaliza el último carácter a `X` mayúscula
- Exige exactamente 18 caracteres: 17 dígitos más un dígito final o `X`
- Compara los primeros 6 dígitos con el conjunto de divisiones administrativas de 2023 y analiza la fecha de nacimiento de 8 dígitos
- Recalcula el dígito de control a partir de los primeros 17 dígitos y lo compara con el último carácter

### Qué muestra el resultado

- Desglose regional: provincia, ciudad, distrito/condado y el código de región original
- Fecha de nacimiento, edad actual, código de secuencia y el género derivado del código de secuencia
- El ID normalizado junto con el dígito de control esperado y el real para depuración

### Ejemplo

`110101199001010015` puede leerse así:

- `110101` -> distrito de Dongcheng, Pekín
- `19900101` -> fecha de nacimiento `1990-01-01`
- `001` -> código de secuencia
- `5` -> dígito de control

### Nota importante

Esta herramienta solo realiza validación estructural y de checksum sin conexión. Un número que supera estas comprobaciones no demuestra que corresponda a una identidad real ni que el documento siga activo.

Los nombres de región se basan en el conjunto de divisiones administrativas de 2023.
