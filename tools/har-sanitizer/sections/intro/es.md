## Cómo limpiar un archivo HAR

Un HAR (HTTP Archive) registra las solicitudes y respuestas de red del navegador. Puede incluir cookies de sesión, tokens de autorización, URL y contenido con datos privados. Crea una copia limpia para enviarla a soporte, adjuntarla a un informe de errores o compartirla con tu equipo. Se conservan el método, el código de estado y los tiempos de cada solicitud.

1. Abre las herramientas para desarrolladores de tu navegador y ve al panel **Red**. Reproduce el problema y exporta el registro como archivo HAR. En Chrome, elige **Exportar HAR (limpio)** para obtener una copia que ya excluya los encabezados de credenciales estándar.
2. Abre o suelta aquí el HAR exportado. La herramienta prepara una copia en cuanto seleccionas el archivo. Prueba el ejemplo para ver qué cambia en una captura de muestra.
3. Revisa los recuentos y pulsa **Descargar HAR limpio**. El nuevo archivo termina en `.sanitized.har` y puedes importarlo en las herramientas para desarrolladores o en el [Analizador de red HAR](/es/tools/har-analyzer/). El procesamiento se realiza en tu navegador.

## Qué datos se eliminan u ocultan

Se eliminan las cookies y los encabezados de autenticación más comunes, como `Authorization` y `X-API-Key`. Por defecto, la herramienta oculta los valores de los parámetros de URL y elimina los cuerpos de solicitudes y respuestas, así como los datos registrados de WebSocket. Por ejemplo, `?token=example&page=2` pasa a ser `?token=REDACTED&page=REDACTED` en el archivo exportado. Los nombres de los parámetros siguen disponibles para la depuración. El recuento incluye cada campo modificado, aunque un mismo valor aparezca en varios campos.

Desactiva la opción correspondiente si necesitas conservar los valores originales o el contenido para reproducir el problema. Los nombres de host, las rutas de URL, otros encabezados y los metadatos propios del navegador pueden contener información privada. Revisa estos campos antes de compartir el archivo.
