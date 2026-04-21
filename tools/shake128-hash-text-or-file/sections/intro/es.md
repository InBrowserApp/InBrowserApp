## ¿Qué es SHAKE128 (FIPS 202)?

SHAKE128 (FIPS 202) es una función de salida extensible (XOF) de la familia SHA-3. A diferencia de las funciones hash de longitud fija, puede devolver cualquier cantidad de bits de salida y mantener una seguridad de 128 bits. Está estandarizada por NIST en FIPS 202 y se basa en la construcción de esponja de Keccak.

Esa flexibilidad es importante cuando un protocolo, un formato de archivo o una regla interna de checksum requiere una longitud concreta de digest. En esta herramienta puedes aplicar hash a texto plano o archivos cargados y elegir la longitud de salida en bits, siempre que sea un múltiplo de 8.

Los usos habituales incluyen hash de protocolos, derivación de claves, resúmenes criptográficos de longitud variable y flujos de integridad de datos donde la misma entrada y la misma longitud de salida deben producir siempre el mismo resultado.
