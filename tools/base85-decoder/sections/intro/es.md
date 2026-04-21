## Por qué importa decodificar Base85

Base85 aparece cuando datos binarios tienen que pasar por sistemas solo de texto con menos sobrecarga que hexadecimal o Base64. Puedes encontrarlo en flujos PostScript o PDF, cargas Z85 de ZeroMQ, capturas de depuración, exportaciones archivadas y herramientas que necesitan caracteres imprimibles en lugar de bytes binarios sin procesar.

## Qué te ayuda a hacer este decodificador

Esta herramienta convierte texto ASCII85 o Z85 de nuevo en sus bytes originales directamente en el navegador. Puedes pegar datos codificados, importar un archivo, cambiar de alfabeto para coincidir con el sistema de origen, previsualizar el resultado decodificado y descargar el binario recuperado sin enviar nada a un servidor.

## Qué debes tener en cuenta

- ASCII85 y Z85 no son intercambiables. Elegir el alfabeto incorrecto suele provocar errores de decodificación o una salida corrupta.
- Base85 es un formato de codificación, no de cifrado. El resultado decodificado puede ser texto plano, contenido comprimido o datos binarios arbitrarios.
- Z85 exige grupos completos de 5 caracteres, mientras que ASCII85 también puede incluir delimitadores y abreviaturas como `z` para bloques de ceros.
