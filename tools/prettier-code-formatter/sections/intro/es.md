## ¿Qué es el formateador de código Prettier?

El formateador de código Prettier ejecuta la versión oficial independiente de Prettier
directamente en tu navegador para que puedas normalizar archivos fuente sin
enviar el código a un servidor. Es útil cuando necesitas un formateo rápido,
quieres comparar distintos ajustes de impresión o necesitas un archivo limpio
que puedas copiar o descargar al instante.

## Formatos compatibles

Esta reescritura mantiene la herramienta centrada en los formatos que Prettier
ya maneja bien en el navegador: JavaScript, TypeScript, Flow, JSON, HTML, CSS,
SCSS, Less, Markdown, MDX, YAML, GraphQL y formatos de plantilla relacionados
como Vue y Handlebars. El selector de idioma controla qué parser se ejecuta, y
al importar un archivo el parser se detecta automáticamente cuando la extensión
es reconocida.

## Cómo funciona esta reescritura

La reescritura mantiene la lógica pesada de formato fuera de la ruta principal
de la interfaz. Las solicitudes de formateo se construyen a partir de una
configuración pura y propia de la herramienta, y luego se ejecutan mediante un
pipeline de Prettier con worker bajo demanda para que la escritura normal siga
siendo ágil. Las entradas grandes pausan el formateo automático y cambian a una
acción explícita `Formatear ahora`, que resulta más predecible que intentar
reformatear un archivo enorme en cada pulsación.
