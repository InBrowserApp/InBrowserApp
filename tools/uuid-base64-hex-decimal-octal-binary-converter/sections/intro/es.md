## Qué convierte esta herramienta

Este conversor trata un UUID como el valor de 128 bits que realmente es y
mantiene sincronizadas las representaciones comunes. Pega un UUID, valor
Base64, cadena hexadecimal, entero decimal, valor octal o valor binario, y los
demás formatos se actualizan localmente en tu navegador.

## Cómo leer los formatos

El campo UUID muestra la forma canónica con guiones. Hexadecimal son los mismos
16 bytes como 32 dígitos hexadecimales en minúsculas. Base64 es Base64 estándar
con relleno para los 16 bytes sin procesar, no Base64 para los caracteres de
texto del UUID. Decimal, octal y binario muestran el UUID como un único entero
sin signo de 128 bits; la salida binaria se rellena por la izquierda hasta los
128 bits para que los ceros iniciales sigan visibles.

## Qué tener en cuenta

Se rechazan los valores fuera del rango UUID de 128 bits. La entrada Base64 debe
decodificarse exactamente en 16 bytes. El conversor acepta variantes comunes
pegadas, como UUID en mayúsculas, prefijos `urn:uuid:`, llaves, UUID compactos
de 32 hex, espacios alrededor de valores numéricos largos y Base64 seguro para
URL. No se sube nada mientras conviertes o generas el UUID de ejemplo.
