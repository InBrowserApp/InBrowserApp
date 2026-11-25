## Cómo normalizar texto Unicode

Pega o escribe el texto en **Texto original** y elige una forma de normalización. El resultado se actualiza al escribir o al cambiar de forma. Selecciona **Copiar resultado** para usar el texto normalizado en otra aplicación. La conversión se realiza en tu navegador y el texto se queda en tu dispositivo.

## ¿Qué forma de normalización Unicode conviene usar?

- **NFC (composición canónica)** es una buena opción para texto de uso general. Si existe un carácter compuesto, combina la letra y su acento en un único punto de código. Úsala para unificar representaciones equivalentes antes de almacenar o comparar texto.
- **NFD (descomposición canónica)** separa las secuencias en sus componentes canónicos, como una letra base y un acento combinante. Úsala para examinar los signos diacríticos o trabajar con ellos por separado.
- **NFKC (composición de compatibilidad)** también unifica variantes de compatibilidad, como las letras de ancho completo y las ligaduras. Resulta útil en búsquedas y comparaciones cuando esas diferencias no importan.
- **NFKD (descomposición de compatibilidad)** aplica las mismas equivalencias de compatibilidad y deja el resultado descompuesto, algo útil para analizar el texto.

## ¿Por qué el texto normalizado puede verse igual?

La letra **é** puede representarse como `U+00E9` o como una **e** seguida de un acento agudo combinante (`U+0065 U+0301`). NFC produce la primera representación y NFD, la segunda. Abre **Comparar puntos de código** para comprobar la secuencia al principio de cada texto, aunque ambos se vean iguales.

Selecciona **Probar un ejemplo** para ver también cambios visibles. Con NFKC, **ＡＢＣ ① ﬁ** se convierte en **ABC 1 fi**. NFC conserva esas diferencias de compatibilidad.

## ¿Cuándo puede cambiar el significado con la normalización?

NFKC y NFKD pueden eliminar diferencias de formato que aportan información, como un superíndice en una fórmula o un número rodeado por un círculo en una lista. Elige NFC si necesitas conservar esas diferencias. Cambiar entre mayúsculas y minúsculas, quitar acentos o pasar de UTF-8 a UTF-16 son operaciones distintas de la normalización.

Encontrarás más información en el [anexo del estándar Unicode sobre las formas de normalización](https://www.unicode.org/reports/tr15/).
