## ¿Qué es SQL Formatter & Linter?

SQL Formatter & Linter reformatea consultas SQL en tu navegador y, al mismo tiempo, las revisa para detectar un pequeño conjunto de problemas de alta señal. Es útil cuando quieres un diseño de consulta más limpio, un uso coherente de mayúsculas en las palabras clave y una respuesta rápida ante patrones de riesgo como `SELECT *` o sentencias `UPDATE` sin cláusula `WHERE`.

## Cuándo Usarlo

Usa esta herramienta cuando estés revisando SQL escrito a mano, limpiando consultas pegadas antes de compartirlas o comparando el formateo entre distintos dialectos de SQL. Funciona bien para revisión puntual de consultas, limpieza de pull requests y formateo solo en el navegador sin enviar tu SQL a un servidor.

## Qué Revisa

Esta versión mantiene el formateador y el linter separados pero coordinados. El formateo usa `sql-formatter` con opciones de diseño sensibles al dialecto, mientras que el lint muestra errores de análisis, puntos y coma ausentes, uso amplio de `SELECT *`, mutaciones inseguras, líneas demasiado largas y discrepancias en el uso de mayúsculas y minúsculas de las palabras clave.
