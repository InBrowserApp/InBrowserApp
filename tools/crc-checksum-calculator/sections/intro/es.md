# Calculadora de suma de verificación CRC

Las sumas de verificación CRC (verificación de redundancia cíclica) son valores
compactos usados para detectar cambios accidentales en los datos. Son comunes en
tramas de red, formatos de archivo comprimido, protocolos embebidos,
actualizaciones de firmware y flujos de trabajo de integridad de archivos, donde
un valor rápido de detección de errores resulta más útil que una firma
criptográfica.

## Cuándo usarla

Usa esta calculadora cuando necesites comparar valores CRC de documentación,
protocolos de hardware, formatos de archivo u otro sistema. Pega texto para
comprobaciones rápidas, o importa un archivo cuando la suma de verificación deba
calcularse a partir del flujo exacto de bytes.

## Variantes compatibles

La herramienta calcula las variantes comunes de la herramienta CRC heredada de
InBrowser.App: CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16,
CRC-16 CCITT, CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32,
CRC-32 MPEG-2, CRCJAM y varios modelos CRC-64, incluidos ECMA-182, GO-ISO, MS,
NVME, REDIS, WE y XZ.

## Aspectos a tener en cuenta

Los nombres de las variantes CRC importan. La misma entrada puede producir
valores diferentes según el polinomio, el valor inicial, la configuración de
reflexión y el XOR final. Si estás comparando con un protocolo o una
especificación de proveedor, elige el resultado cuyo nombre de variante coincida
con esa especificación en lugar de tratar todos los anchos de CRC como
intercambiables.

CRC está diseñado para la detección de errores accidentales, no para el
almacenamiento de contraseñas, firmas o seguridad a prueba de manipulación. Para
verificaciones sensibles a la seguridad, usa en su lugar un flujo de trabajo de
hash criptográfico o de firma.
