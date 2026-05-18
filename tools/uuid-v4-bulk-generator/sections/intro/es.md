Genera un lote de identificadores UUID v4 directamente en tu navegador cuando necesites ID aleatorios para filas de bases de datos, fixtures de API, claves de objetos, cargas de prueba, plantillas de importación o trabajo operativo puntual.

## What UUID v4 Provides

UUID v4 es un identificador de 128 bits construido principalmente a partir de bytes aleatorios criptográficamente seguros. Los bits de versión y variante están fijados por el diseño de RFC 4122, por lo que un UUID v4 tiene la forma familiar `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` y, aun así, conserva un espacio aleatorio muy grande.

## Pick A Practical Batch Size

El lote predeterminado te da suficientes ID para muchos flujos de trabajo con fixtures y hojas de cálculo sin hacer que la página sea difícil de revisar. Aumenta la cantidad cuando prepares una importación más grande, o redúcela cuando solo necesites unos pocos identificadores para una muestra de solicitud o una edición manual en la base de datos.

## Copy Or Export

Revisa la lista generada y luego cópiala en tu editor o descarga un archivo de texto sin formato. Cada valor se genera localmente, y este recurso nunca sube el lote actual.

## Collision Guidance

El riesgo de colisión de UUID v4 es extremadamente bajo para cargas de trabajo de aplicaciones normales, pero no sustituye a una restricción de unicidad en la base de datos. Sigue aplicando unicidad cuando el ID se convierta en una clave primaria, token público o referencia duradera.
