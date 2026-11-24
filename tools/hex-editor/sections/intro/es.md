## Cómo ver y editar un archivo binario en línea

Abre o arrastra un archivo local al editor hexadecimal. También puedes elegir **Probar con un ejemplo** para familiarizarte con la vista de bytes. Puedes inspeccionar la cabecera de un archivo, comprobar su firma (por ejemplo, `89 50 4E 47` en un PNG), examinar bytes sin representación visible o corregir un valor en una posición concreta.

## Cómo leer los desplazamientos, los bytes en hexadecimal y la columna ASCII

El desplazamiento de la izquierda indica la posición del primer byte de la fila, contando desde cero. En el centro, cada byte aparece como dos dígitos hexadecimales, de `00` a `FF`. La columna ASCII muestra los caracteres imprimibles que corresponden a esos mismos bytes y pone un punto en los demás casos. Por ejemplo, los bytes `48 65 6C 6C 6F` aparecen como `Hello`.

Para ir directamente al byte 26, introduce un desplazamiento hexadecimal como `1A` o `0x1A`. Usa los controles de página para recorrer los bytes cercanos. El editor lee una página cada vez, lo que te permite inspeccionar una parte pequeña de un archivo grande.

## Cómo sobrescribir bytes y guardar una copia

Selecciona un byte en la vista hexadecimal y escribe dos dígitos. El editor actualiza el carácter ASCII correspondiente y avanza al siguiente byte. Usa las teclas de flecha para moverte entre bytes y las opciones **Deshacer** y **Rehacer** para recorrer el historial de cambios. Al sobrescribir un byte se conservan el tamaño del archivo y las posiciones de los demás bytes.

Elige **Descargar copia** para guardar el resultado. El archivo original queda intacto y toda la lectura y la edición se hacen en tu navegador.
