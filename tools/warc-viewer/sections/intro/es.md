## Abrir un archivo web WARC

Selecciona o arrastra un archivo `.warc` o `.warc.gz`, o prueba el archivo de ejemplo. El visor genera una lista de registros de captura y abre la primera página HTML archivada que encuentra. Para localizar una captura, filtra por URL o tipo de registro y alterna entre la vista previa de la página y los detalles del registro. Indexar un archivo grande puede llevar tiempo. El archivo permanece en tu navegador.

## Consultar las fechas de captura y las cabeceras

Un archivo Web ARChive (WARC) almacena los registros que recoge un rastreador o una herramienta de archivado al visitar un sitio web. Varios registros pueden compartir una URL. Para distinguirlos, consulta la fecha de captura en UTC y el estado HTTP original. Un registro de respuesta contiene lo que devolvió el servidor. Un registro de solicitud describe lo que envió el rastreador. Un registro de revisita puede remitir a otra captura sin guardar otra copia de la página. Puedes consultar estos registros aunque no haya vista previa.

## ¿Qué incluye la vista previa?

La vista previa estática usa el HTML y las imágenes y hojas de estilo compatibles que contiene el mismo archivo. Si faltan recursos, el diseño puede cambiar o mostrar huecos. Los scripts están desactivados y la vista previa no envía solicitudes al sitio original, por lo que funciones interactivas como el inicio de sesión y la reproducción de vídeo no están disponibles. El visor admite WARC 1.0 y 1.1, incluidos los registros comprimidos con gzip.

[Especificación del formato WARC](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
