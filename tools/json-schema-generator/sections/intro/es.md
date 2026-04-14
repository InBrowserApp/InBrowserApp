## ¿Qué es JSON Schema?

JSON Schema es un estándar para describir la estructura de datos JSON. Permite expresar tipos de campos, estructuras anidadas, claves obligatorias y restricciones útiles para validación.

### Qué hace este generador

Pega un JSON de ejemplo y la herramienta infiere un schema inicial para objetos, arreglos, números, booleanos, valores null y formatos de cadena comunes. El resultado se puede copiar, descargar y ajustar.

### Ejemplo

Por ejemplo, con esta carga de ejemplo:

**Entrada de ejemplo**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Schema generado**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "price": { "type": "number" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "published": { "type": "boolean" }
  },
  "required": ["id", "title", "price", "tags", "published"]
}
```

### Consejos

- Usa datos de ejemplo representativos, sobre todo dentro de arreglos, para detectar mejor los campos opcionales.
- Desactiva “Infer required properties” si la entrada es solo un ejemplo parcial.
- Desactiva “Allow additional properties” si quieres un schema más estricto por defecto.
- Mantén activa la detección de formatos para inferir email, URI, UUID y date-time.
