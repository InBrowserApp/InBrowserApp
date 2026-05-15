La colección de herramientas hash reúne las utilidades de hash migradas para que puedas elegir el algoritmo adecuado antes de abrir una herramienta específica. Cubre resúmenes de archivos cotidianos, comprobaciones de compatibilidad heredada, autenticación de mensajes con clave, cadenas de Subresource Integrity, hash de contraseñas, verificación de contraseñas y sumas de comprobación no criptográficas rápidas.

## Cuándo usar estas herramientas

Usa las herramientas de resumen criptográfico cuando necesites una huella repetible para texto o un archivo, por ejemplo para comparar un archivo descargado con una suma de comprobación SHA-256 publicada. Usa HMAC cuando el resultado deba demostrar que alguien con un secreto compartido creó o aprobó el mensaje. Usa Argon2, bcrypt, PBKDF2 o scrypt para flujos de trabajo de contraseñas y derivación de claves, donde el coste configurable importa más que la velocidad bruta.

## Elegir con seguridad

No todos los hashes son adecuados para seguridad. MD4, MD5 y SHA-1 son útiles para sistemas heredados y comprobaciones de compatibilidad, pero no deberían usarse en nuevos diseños de integridad sensibles a la seguridad. CRC, Adler-32, MurmurHash, CityHash y xxHash son sumas de comprobación rápidas o hashes de agrupación, no firmas resistentes a la manipulación. Si no tienes claro cuál usar, prefiere SHA-256 para sumas de comprobación públicas, HMAC-SHA-256 para verificación con clave y Argon2id o bcrypt para almacenar contraseñas.

## Privacidad y flujo de trabajo

Las herramientas individuales de esta colección se ejecutan en el navegador. El texto y los archivos se procesan localmente con la herramienta seleccionada, salvo que esa herramienta documente explícitamente un comportamiento de consulta pública, algo que las herramientas hash no necesitan. Para material sensible, borra los valores generados después de usarlos y evita pegar secretos en sesiones de navegador compartidas o grabadas.
