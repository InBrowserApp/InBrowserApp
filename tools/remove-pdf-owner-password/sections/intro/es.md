Quita las restricciones de contraseña de propietario de un PDF directamente en tu navegador. La herramienta crea un PDF nuevo que ya no conserva marcas de permisos para editar, imprimir, copiar o extraer páginas.

## Cuándo usarla

Úsala cuando ya tengas un PDF que se abre con normalidad, pero el documento bloquea acciones habituales como imprimir, copiar texto, editar páginas o reunir páginas en otra herramienta de PDF. Esto es común en formularios, informes exportados, facturas antiguas y documentos creados con ajustes restrictivos de permisos de PDF.

## Cómo funciona

Sube un PDF, revisa el archivo seleccionado y ejecuta el paso de eliminación. La herramienta ejecuta qpdf en un proceso en segundo plano del navegador con la operación `--decrypt` de PDF y devuelve un archivo PDF nuevo para descargar. El archivo original no se modifica, para que puedas comparar o descartar la salida si no es la versión que necesitas.

## Privacidad y limitaciones

El PDF permanece en esta sesión del navegador; no se sube a ningún servidor. Esta herramienta elimina las restricciones de permisos de contraseña de propietario de los PDF que ya se pueden abrir. No recupera una contraseña de usuario/apertura perdida y no puede desbloquear archivos dañados ni modos de cifrado no compatibles con la compilación de qpdf para el navegador.
