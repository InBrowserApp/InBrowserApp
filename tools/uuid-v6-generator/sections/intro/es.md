El Generador de UUID v6 crea UUID basados en tiempo que conservan la forma familiar de UUID mientras colocan primero la marca de tiempo para una ordenación léxica natural. Funciona por completo en tu navegador, por lo que los identificadores generados y los valores de nodo opcionales nunca salen de la página.

## Cuándo ayuda UUID v6

Usa UUID v6 cuando necesites identificadores que sigan siendo ampliamente compatibles con herramientas para UUID, pero que también se ordenen cerca del orden de creación en registros, índices de bases de datos, flujos de eventos o scripts de migración. UUID v6 es semánticamente lo más cercano a UUID v1: usa una marca de tiempo gregoriana, una secuencia de reloj y un campo de nodo de 48 bits, pero reorganiza los bits de la marca de tiempo para que los IDs más nuevos se ordenen después de los más antiguos.

## IDs de nodo y privacidad

Los generadores clásicos de UUID v1 suelen usar una dirección MAC real como campo de nodo. Esta herramienta usa de forma predeterminada un ID de nodo aleatorio y administrado localmente para cada UUID generado, de modo que no exponga una dirección de hardware. Cambia a un nodo personalizado solo cuando necesites intencionalmente una salida compatible con v1 para datos de prueba, comprobaciones de interoperabilidad o sistemas controlados.

## Secuencia de reloj y hora personalizada

La secuencia de reloj ayuda a evitar colisiones cuando las marcas de tiempo se repiten o los relojes retroceden. La secuencia aleatoria predeterminada es la opción más segura para el uso normal. Las marcas de tiempo, IDs de nodo y secuencias de reloj personalizados son útiles para ejemplos deterministas, pero los valores personalizados repetidos deben usarse con cuidado en datos de producción.
