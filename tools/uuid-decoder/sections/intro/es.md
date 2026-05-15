# ¿Qué es un decodificador de UUID?

Un decodificador de UUID explica la estructura interna de un identificador único universal. Normaliza los formatos comunes pegados, comprueba que el valor sea un UUID de 128 bits y muestra la versión, la variante, los bytes hexadecimales sin procesar y representaciones numéricas listas para copiar.

Los UUID suelen tratarse como cadenas opacas, pero el nibble de versión indica cómo se creó el identificador. Los UUID de versión 4 son aleatorios, las versiones 3 y 5 son hashes basados en nombre, y las versiones ordenadas por tiempo, como 1, 6 y 7, pueden contener información de marca temporal.

## Cuándo usarlo

Usa esta herramienta cuando necesites inspeccionar un identificador de registros, bases de datos, API, trazas o datos de prueba. Es útil para confirmar si un UUID es aleatorio o basado en tiempo, convertirlo a decimal o Base64 para otro sistema y detectar si el campo de nodo de un UUID v1 o v6 puede exponer un identificador de estilo MAC.

El decodificador se ejecuta en tu navegador y no envía valores UUID a un servidor. Acepta UUID canónicos, valores `urn:uuid:`, UUID entre llaves, entradas en mayúsculas y UUID hexadecimales de 32 caracteres sin guiones.

## Qué tener en cuenta

Los campos de versión y variante de UUID describen la distribución de bits, no si el identificador es globalmente único en la práctica. Un UUID que parece válido puede duplicarse si se generó mal o se copió por error.

En los UUID de versión 1 y versión 6, el campo de nodo puede parecer una dirección MAC. Los generadores modernos pueden activar el bit de multidifusión y usar en su lugar un nodo aleatorio, así que trátalo como identificador de nodo a menos que controles el generador.
