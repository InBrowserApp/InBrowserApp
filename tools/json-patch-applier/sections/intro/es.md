## Cómo aplicar un JSON Patch

Pega el documento JSON original en el primer editor y un arreglo JSON Patch RFC 6902 en el segundo. Selecciona **Aplicar parche** para previsualizar y copiar el JSON actualizado. Para generar un parche, compara los documentos original y modificado en [Ruta de diferencias JSON](../json-diff-path/) y copia la salida **JSON Patch**. Aplícala al mismo documento original.

## Ejemplo de JSON Patch

El documento original contiene un estado y una etiqueta.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

El parche comprueba el estado original, lo actualiza y añade una etiqueta.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

El resultado es `{"status":"published","tags":["api","release"]}`.

## Operaciones admitidas y sintaxis de JSON Pointer

- `add` crea o sobrescribe una propiedad de un objeto, inserta un elemento en un arreglo o reemplaza el documento en la raíz.
- `remove` elimina un valor existente. `replace` sustituye un valor existente por uno nuevo.
- `move` toma un valor existente de la ruta `from` y lo inserta en `path`. `copy` inserta una copia independiente.
- `test` comprueba si el valor en `path` coincide con el `value` indicado sin modificar el documento.

Las rutas usan la sintaxis JSON Pointer de RFC 6901. Los índices de un arreglo empiezan en cero, por lo que `/tags/0` se refiere a la primera etiqueta. Si una operación agrega un valor al arreglo, `/tags/-` lo añade al final. Usa `~1` para una barra y `~0` para una virgulilla dentro de una clave de objeto. Por ejemplo, `/a~1b` señala la clave `a/b`. La ruta vacía `""` señala el documento completo y `/` señala una propiedad con una clave vacía.

## Por qué falla una operación de JSON Patch

Las operaciones se ejecutan en el orden del arreglo. Cada operación trabaja con el resultado de las anteriores. Si un destino no existe, un índice se sale de los límites del arreglo o el valor de una comprobación `test` difiere del esperado, la herramienta resalta el primer fallo y se detiene. La vista previa del JSON solo aparece si el parche completo se aplica correctamente. Un parche con un arreglo vacío `[]` devuelve el documento original.

El navegador aplica el parche de forma local. El JSON original y el parche se quedan en tu navegador.
