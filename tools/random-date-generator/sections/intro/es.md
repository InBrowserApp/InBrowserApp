## Generar fechas aleatorias dentro de un intervalo

Introduce una **Fecha de inicio** y una **Fecha de fin**, elige un formato de salida y selecciona **Generar**. Ambos extremos están incluidos, por lo que un intervalo entre `2024-02-28` y `2024-03-01` también puede producir el día bisiesto `2024-02-29`. Una misma fecha puede aparecer varias veces en un lote. Copia los resultados o descarga un archivo de texto `UTF-8` con una fecha por línea.

## Elegir una fecha ISO o localizada

Usa **ISO (YYYY-MM-DD)** para datos de prueba, importaciones a hojas de cálculo o fechas que se ordenen cronológicamente como texto. Usa **Fecha localizada** para mostrar la fecha del calendario gregoriano en el idioma de la página. Por ejemplo, `2024-02-29` aparece como `Feb 29, 2024` en la página en inglés y como `29.02.2024` en la página en alemán.

## Usar el mismo día del calendario en distintas zonas horarias

El intervalo utiliza los límites de día en UTC. Una fecha elegida en cualquiera de los extremos permanece en el mismo día del calendario dondequiera que se muestre el generador. Si estableces la misma fecha de inicio y de fin, se genera solo esa fecha, algo útil para probar días bisiestos o el primer o último día de un mes.
