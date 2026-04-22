## ¿Qué es la Integridad de Subrecursos (SRI)?

La Integridad de Subrecursos (SRI) es una característica de seguridad que permite a los navegadores verificar que los archivos que obtienen (por ejemplo, de un CDN) no han sido modificados inesperadamente. Funciona comparando el hash criptográfico de un recurso con un hash proporcionado en el HTML.

**Cómo funciona:**

1. Generar un hash criptográfico de tu archivo de recurso
2. Incluir el hash en el atributo integrity de las etiquetas script o link
3. El navegador obtiene el recurso y calcula su hash
4. El navegador compara el hash calculado con el hash proporcionado
5. Si los hashes coinciden, el recurso se carga; si no, la carga se bloquea

**Beneficios:**

- **Seguridad**: Protege contra modificaciones maliciosas de recursos de terceros
- **Protección CDN**: Asegura que los archivos servidos por CDN no han sido alterados
- **Seguridad de la cadena de suministro**: Valida la integridad de dependencias externas
- **Soporte del navegador**: Ampliamente soportado en navegadores modernos

**Algoritmos soportados:**

- SHA-256 (mínimo recomendado)
- SHA-384 (recomendado)
- SHA-512 (máxima seguridad)
