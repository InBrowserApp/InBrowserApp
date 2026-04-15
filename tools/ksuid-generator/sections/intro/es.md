## ¿Qué es KSUID?

KSUID (K-Sortable Unique IDentifier) es un identificador base62 de 27 caracteres que incrusta un timestamp de 32 bits (segundos desde 2014-05-13) y 128 bits de datos aleatorios.

**Puntos clave:**

- **Ordenable por tiempo**: el orden lexicográfico sigue el tiempo de creación.
- **Alta unicidad**: 128 bits de aleatoriedad por ID.
- **Precisión de segundos**: KSUID solo guarda segundos, los milisegundos se redondean hacia abajo.
