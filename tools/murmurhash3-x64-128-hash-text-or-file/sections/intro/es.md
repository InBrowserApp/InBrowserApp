## ¿Qué es MurmurHash3 (x64 de 128 bits)?

MurmurHash3 es un algoritmo de hash no criptográfico rápido, diseñado para
sumas de comprobación repetibles y bien distribuidas. La variante x64 de 128
bits devuelve un valor de 16 bytes, que normalmente se muestra como 32
caracteres hexadecimales; esto la hace más adecuada que los hashes de 32 bits
cuando necesitas un identificador más amplio para conjuntos grandes de
registros, archivos o claves de caché.

**Dónde ayuda:**

- **Tablas hash y particionado**: Crea claves estables para buckets,
  particiones o tablas de búsqueda.
- **Deduplicación**: Compara grandes conjuntos de texto o archivos con huellas
  compactas de 128 bits antes de hacer comprobaciones más profundas.
- **Claves de caché**: Produce identificadores deterministas para artefactos de
  compilación, datos transformados o contenido generado.
- **Comprobaciones de integridad no orientadas a seguridad**: Detecta cambios
  accidentales durante el almacenamiento o la transferencia cuando no se
  requieren garantías criptográficas.

**Comportamiento de la semilla:**

La semilla opcional es un valor sin signo de 32 bits. Usa la misma semilla
cuando necesites que los resultados coincidan con otro sistema, y déjala en `0`
cuando no tengas un requisito de compatibilidad específico. Se aceptan valores
decimales y valores hexadecimales `0x`; los valores mayores se ajustan por
desbordamiento al mismo rango de 32 bits que usa el algoritmo.

**Notas de seguridad:**

MurmurHash3 no es un algoritmo para hashing de contraseñas, firma ni
verificación resistente a manipulaciones. Usa SHA-256, HMAC o una herramienta
de hashing de contraseñas cuando la salida necesite propiedades de seguridad.
Esta herramienta es más adecuada para hashing local, sin conexión y orientado
al rendimiento, cuando importan más la velocidad y la distribución estable que
la resistencia a ataques.
