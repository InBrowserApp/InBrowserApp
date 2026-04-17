## ¿Qué es un número de IVA de la UE?

Un número de identificación de IVA lo emite un Estado miembro de la UE a las empresas que están registradas a efectos del Impuesto sobre el Valor Añadido. Comienza con un código de país de dos letras (por ejemplo, `BE` para Bélgica o `EL` para Grecia), seguido de una secuencia de cifras y, a veces, letras, específica de cada país. Las autoridades fiscales lo utilizan para hacer un seguimiento del comercio transfronterizo y de las solicitudes de devolución, por lo que los errores en facturas, contratos o registros de compras pueden bloquear fácilmente un pago o desencadenar una auditoría.

## Lo que esta herramienta comprueba realmente

Este verificador ejecuta tres validaciones independientes, todas en tu navegador:

1. **Código de país** — las dos letras iniciales deben corresponder a un Estado miembro de la UE que participe en el régimen de IVA (incluido el código especial `EL` utilizado para Grecia).
2. **Formato** — los caracteres restantes deben coincidir con el formato de IVA documentado del país. Por ejemplo, el IVA belga tiene exactamente diez dígitos, el IVA austríaco empieza por `U` seguido de ocho dígitos, y el IVA neerlandés tiene la forma `<nueve dígitos>B<dos dígitos>`.
3. **Suma de verificación** — cuando existe una suma de verificación determinista en las reglas de IVA del país (Austria, Bélgica, Dinamarca, Finlandia, Francia, Alemania, Italia, Países Bajos, Polonia, Portugal, España, Suecia), se recalcula el dígito o letra final y se compara.

Un número que supera las tres comprobaciones está bien formado sintácticamente. Eso no equivale a confirmar que la empresa esté registrada actualmente — para eso necesitas el servicio VIES de la Comisión Europea o la autoridad fiscal local. Esta herramienta es ideal para usarla antes de esa comprobación final, con el fin de detectar erratas, dígitos transpuestos y errores de copiar y pegar que hacen que una consulta a VIES falle por el motivo equivocado.

## Errores habituales que detecta

- Números que a primera vista parecen correctos pero les falta un país (por ejemplo, que empiezan por `US` o `UK`).
- Ceros a la izquierda eliminados por una hoja de cálculo, produciendo un número con un dígito menos de lo debido.
- Espacios, puntos o guiones que un sistema de facturación ha pegado — la herramienta los normaliza y comprueba el resultado.
- La clásica confusión entre el `GR` griego y el `EL` del IVA, que la comprobación de formato rechaza de inmediato.

## Lo que muestra la tarjeta de resultados

Más allá de una simple etiqueta de válido/no válido, el resultado desglosa el país, el número normalizado, el formato que el país espera y si la suma de verificación se superó, falló o se omitió porque el país no publica una. Ese detalle resulta útil cuando necesitas explicar un rechazo — "el formato es correcto, la suma de verificación no coincide" es mucho más accionable que "no válido".

## Privacidad

Cada comprobación se ejecuta localmente en tu navegador. No se envía nada a ningún servidor, no se registra ni se almacena en ningún lugar aparte del localStorage de tu propio navegador (para la última entrada que hayas escrito, de modo que sobreviva a una recarga de página). Puedes pegar el número de IVA de un cliente sin preocuparte por dónde acaba.
