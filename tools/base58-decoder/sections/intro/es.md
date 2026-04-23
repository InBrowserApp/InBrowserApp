## Para que sirve esta herramienta

Usa esta herramienta para decodificar cadenas Base58 o archivos de texto y
recuperar sus bytes originales directamente en el navegador. Resulta util para
inspeccionar datos copiados desde APIs, billeteras, registros, flujos con QR o
procesos de importacion y exportacion sin enviar el contenido a un servidor.

## Cuando cambiar el alfabeto

Base58 no tiene un alfabeto universal. Bitcoin, Flickr y Ripple usan ordenes de
caracteres diferentes. Si un valor no pasa la validacion o se decodifica con un
resultado incorrecto, cambia el alfabeto y prueba con el formato usado por el
sistema de origen.

## Que tener en cuenta

El panel de salida muestra una vista previa UTF-8 cuando los bytes decodificados
pueden leerse como texto. Para datos binarios o contenido no textual, es mejor
revisar el archivo .bin descargado. Los espacios y saltos de linea pegados se
ignoran, por lo que tambien puedes decodificar valores partidos en correos,
documentos o terminales.
