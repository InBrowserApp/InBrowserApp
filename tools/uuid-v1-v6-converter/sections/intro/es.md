UUID v1 y UUID v6 contienen la misma información principal: una marca de tiempo, una secuencia de reloj y un identificador de nodo. UUID v1 almacena la marca de tiempo en el orden histórico de campos de UUID, mientras que UUID v6 reordena esos bits de marca de tiempo para que la ordenación lexicográfica simple siga la hora de creación de forma más natural.

Usa esta herramienta cuando necesites mover identificadores entre sistemas que esperan distintas estructuras de UUID basados en tiempo. Pega un UUID v1 para obtener su equivalente UUID v6, o pega un UUID v6 para recuperar la representación UUID v1. La conversión es determinista y mantiene sin cambios la secuencia de reloj y los bytes de nodo.

## Cuándo usarlo

- Migrar registros desde almacenamiento heredado con UUID v1 a UUID v6 conservando los metadatos de identidad.
- Depurar bases de datos, registros o colas que mezclan valores UUID v1 y UUID v6.
- Comprobar si un valor UUID v6 vuelve a asignarse al valor UUID v1 esperado por una integración antigua.

## Formato de entrada

El conversor acepta cadenas UUID canónicas con guiones, cadenas UUID compactas de 32 caracteres, UUID en mayúsculas, valores `urn:uuid:` y UUID entre llaves. Los resultados siempre se normalizan a la forma UUID canónica en minúsculas.

## Notas de privacidad y compatibilidad

UUID v1 y UUID v6 pueden codificar la hora de creación e información del nodo. Trátalos como identificadores operativos, no como secretos, y evita exponerlos cuando la marca de tiempo o los metadatos del nodo puedan ser sensibles. Esta herramienta se ejecuta localmente en tu navegador y no sube tus UUID.
