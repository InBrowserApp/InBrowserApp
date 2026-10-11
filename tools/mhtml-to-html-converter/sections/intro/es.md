## Convierte un archivo web guardado de forma local

Abre un archivo local `.mhtml` o `.mht`, revisa la página principal convertida y descarga un archivo HTML independiente en UTF-8. Los recursos incluidos se conservan dentro del archivo para que pueda abrirse sin conexión. Para leer archivos recuperados o incompletos, usa el [Visor de MHTML](../mhtml-viewer/).

## Resultado y compatibilidad

Las referencias content-location y content-ID compatibles se resuelven dentro del archivo. El texto, el formato básico, las tablas, los enlaces, las imágenes de mapa de bits incluidas y los estilos compatibles se conservan en un documento estático legible. El texto sigue siendo seleccionable. Los marcadores internos permanecen en el documento y los enlaces externos solo se abren al seleccionarlos. El zoom de la vista previa no cambia el archivo descargado. Las fuentes y los diseños complejos pueden diferir de la página guardada original.

Se omiten los scripts, los formularios, las redirecciones, las aplicaciones incrustadas, SVG y MathML. No se restauran las sesiones del sitio web ni las funciones interactivas. Los archivos incompletos, las codificaciones de texto no compatibles, las páginas adicionales y los recursos ausentes detienen la conversión sin ofrecer una descarga parcial. Las imágenes incrustadas, incluidas las imágenes de fondo CSS, deben decodificarse correctamente. Si la conversión falla, guarda una captura completa del documento principal por separado. Los mensajes de correo electrónico y los archivos HTML simples requieren sus herramientas correspondientes.

## Privacidad y recursos del navegador

Los archivos permanecen en este navegador. Los recursos ausentes nunca se obtienen de tu ordenador ni del sitio web en línea, y el contenido de los archivos nunca se sube. El HTML generado bloquea los scripts y la carga de recursos externos al abrirse sin conexión. Seguir un enlace externo es una acción independiente que puede contactar con ese sitio. Puedes cancelar, cerrar o reemplazar el archivo. No hay un límite fijo de tamaño de archivo ni de número de páginas; los archivos grandes dependen de la memoria disponible del navegador, y los fallos de recursos se notifican cuando se pueden detectar.
