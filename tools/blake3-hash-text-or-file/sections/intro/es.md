## ¿Qué es BLAKE3?

BLAKE3 es una función hash criptográfica moderna derivada de BLAKE2. Está diseñada para un rendimiento muy alto y paralelismo manteniendo una seguridad sólida. Produce un hash de 256 bits por defecto y admite longitud de salida extendible (XOF).

**Características clave:**

- **Longitud de salida extendible**: Puede producir hashes de cualquier longitud
- **Alto rendimiento**: Rápido y paralelizable en CPUs modernas
- **Determinístico**: La misma entrada siempre produce el mismo hash
- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas drásticamente diferentes
- **Irreversible**: Es computacionalmente inviable revertir el hash para encontrar la entrada original
- **Resistente a colisiones**: Muy difícil encontrar dos entradas diferentes que produzcan el mismo hash
- **Hash con clave**: Admite una clave opcional de 32 bytes para funcionalidad MAC
- **Derivación de claves**: Puede derivar subclaves a partir de material de clave y contexto

**Usos comunes:**

- Verificación de integridad de archivos
- Almacenamiento direccionado por contenido y deduplicación
- Firmas digitales y certificados
- Almacenamiento y autenticación de contraseñas
- Protocolos y sistemas criptográficos
