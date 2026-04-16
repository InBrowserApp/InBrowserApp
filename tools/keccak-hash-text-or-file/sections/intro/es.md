## ¿Qué es Keccak?

Keccak es una familia de funciones hash criptográficas que sirve como base para el estándar SHA-3 (Secure Hash Algorithm 3). Desarrollado por Guido Bertoni, Joan Daemen, Michaël Peeters y Gilles Van Assche, ganó la competencia de funciones hash NIST en 2012.

**Características clave:**

- **Construcción esponja**: Usa un diseño innovador de función esponja con fases de absorción y exprimido
- **Longitud de salida variable**: Puede producir salidas hash de cualquier longitud deseada
- **Alto margen de seguridad**: Diseñado con reservas de seguridad sustanciales
- **Diferente de SHA-1/SHA-2**: Basado en principios matemáticos completamente diferentes
- **Variante Keccak[c=2d]**: Esta implementación usa la especificación Keccak original con capacidad c = 2d (donde d es la longitud de salida)

**Diferencias entre Keccak y SHA-3 (FIPS 202):**
🔍 **Distinción importante**: El Keccak original y el SHA-3 estandarizado **no son idénticos**:

- **Keccak original**: Usa capacidad c = 2d y relleno diferente (relleno Keccak: 0x01)
- **FIPS 202 SHA-3**: Usa capacidad c = 2d pero relleno diferente (relleno SHA-3: 0x06)
- **Separación de dominio**: La diferencia de relleno asegura que Keccak y SHA-3 produzcan salidas diferentes para la misma entrada
- **Esta herramienta implementa**: La **especificación Keccak original** con parametrización Keccak[c=2d]

**Estado de seguridad:**
✅ **Keccak se considera altamente seguro** sin ataques prácticos conocidos. Proporciona excelentes márgenes de seguridad y resistencia contra varias técnicas criptoanalíticas.

**Usos comunes:**

- Blockchain de Ethereum (usa Keccak-256 original)
- Investigación académica y protocolos criptográficos
- Aplicaciones que requieren salidas hash de longitud variable
- Sistemas que necesitan alternativas a la familia SHA-2
- Implementaciones de blockchain y criptomonedas

**Ventajas sobre hashes tradicionales:**

- Diseño fundamentalmente diferente reduce el riesgo de ataques relacionados
- Longitud de salida flexible (no limitada a tamaños fijos)
- Base de seguridad teórica sólida
- Resistencia a ataques de extensión de longitud
- Excelente rendimiento en varias plataformas

**Nota técnica:**

- **Keccak-256**: Produce salida de 256 bits (variante más común)
- **Fórmula de capacidad**: c = 2d asegura el nivel de seguridad apropiado
- **Uso en Ethereum**: Ethereum específicamente usa Keccak-256 original, no SHA3-256
