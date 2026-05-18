# Fusiona archivos PDF en tu navegador

Usa este fusionador de PDF cuando necesites un solo documento a partir de varios PDF de origen, como combinar páginas escaneadas, unir formularios firmados o empaquetar informes para compartirlos. Agrega dos o más archivos, revisa sus recuentos de páginas y luego organiza la cola antes de crear el PDF final.

## Cómo funciona el orden de fusión

La herramienta agrega todas las páginas del primer PDF, luego todas las páginas del siguiente PDF y continúa así hasta el final de la cola. Puedes reordenar archivos con los controles de flecha, arrastrar filas en escritorio, eliminar errores y previsualizar cada archivo de origen antes de fusionar.

## Privacidad y manejo de archivos

Todo el análisis y la fusión se ejecutan localmente en tu navegador con `pdf-lib` y un worker en segundo plano. Tus archivos no se suben a InBrowser.App, y el enlace de descarga generado solo existe en la sesión actual del navegador.

## Límites que debes conocer

Los PDF cifrados o dañados no se pueden fusionar de forma fiable. Si un archivo está protegido por una contraseña de propietario, elimina primero esa restricción y vuelve a agregar el PDF desbloqueado. Los archivos muy grandes pueden tardar más porque el navegador tiene que copiar cada página en un documento nuevo.
