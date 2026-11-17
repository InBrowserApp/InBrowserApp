## Inspeccionar datos binarios de API

CBOR y MessagePack son formatos compactos de serialización binaria para datos estructurados. Usa este conversor para inspeccionar respuestas de API, mensajes WebSocket o valores en caché como JSON, o para crear datos binarios a partir de JSON durante la depuración. Todo se procesa en tu navegador; las entradas no se suben ni se guardan.

## Codificar JSON o decodificar bytes

Elige el formato binario y la dirección de conversión. Para codificar, introduce JSON y elige Hex, Base64 o Base64URL para la salida. Para decodificar, pega los bytes y selecciona su codificación de entrada. Al cambiar la codificación de entrada, se reinterpreta el texto que ya está en el editor.

Abre un archivo JSON al codificar, o un archivo binario `.cbor`, `.msgpack` o `.bin` al decodificar. El texto codificado, como Hex o Base64, debe pegarse en el editor. Convierte y, a continuación, copia el texto mostrado o descarga el resultado. Las descargas binarias contienen los bytes reales y pueden volver a importarse.

## Conservar valores y comprender los límites

Los literales enteros conservan todos sus dígitos dentro del rango de 64 bits admitido por el formato. Los valores que JSON no puede representar, como campos binarios, etiquetas CBOR y extensiones MessagePack, aparecen como envoltorios tipados explícitos. Activa JSON extendido para volver a codificar esos envoltorios en binario; déjalo desactivado para objetos JSON normales que simplemente usen claves de envoltorio.

Por ejemplo, con JSON extendido activado, `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` codifica un entero exacto y dos bytes binarios.

Cada conversión procesa un valor, con un límite de entrada de 1 MiB. «Bytes de JSON formateado» cuenta el JSON mostrado con formato legible, no la entrada original. Al volver a codificar se conservan los valores compatibles, pero puede cambiar el orden del mapa o la codificación binaria elegida. Abre «Formatos y fidelidad de tipos» arriba para consultar la sintaxis de los envoltorios y los tipos no compatibles.
