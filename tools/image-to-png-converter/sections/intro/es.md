## Convierte una imagen a PNG

Abre una imagen local, inspecciona la vista previa y descarga la imagen seleccionada como PNG. La imagen guardada conserva sus dimensiones completas en píxeles, la orientación aplicada y la transparencia compatible. Los controles de zoom, ajuste y fondo solo afectan a la vista previa; no cambian el tamaño de la salida ni eliminan la transparencia.

## Formatos y selección de imágenes

Lee JPEG, PNG, GIF, BMP, WebP, imágenes estáticas AVIF, TIFF, ICO, imágenes estáticas y colecciones HEIC/HEIF, JPEG XL, JP2 y flujos de código JPEG 2000 (J2K). Se comprueba el contenido del archivo en lugar de confiar en su extensión. La compatibilidad depende de la codificación interna del archivo. Para las imágenes vectoriales SVG, usa el Convertidor de SVG a imagen para convertirlas a PNG.

En los archivos que contienen varias imágenes, selecciona la página TIFF, el tamaño del icono, la imagen de la colección o el fotograma de animación antes de descargar. Cada descarga es un PNG estático, con el número de página o fotograma incluido en el nombre del archivo. Los fotogramas GIF, WebP animado y JPEG XL se recomponen en imágenes completas. Los PNG animados solo exportan su imagen estática predeterminada, identificada como póster; no pueden exportar otros fotogramas ni conservar la animación.

## Fidelidad y archivos no compatibles

La salida usa canales de 8 bits. Se reducen la alta profundidad de bits y el HDR, por lo que convertir a PNG no recupera la precisión del original. Los perfiles de color incrustados se conservan cuando son compatibles, pero los colores pueden diferir de los de un editor con gestión del color. Las imágenes auxiliares, los mapas de profundidad y los metadatos del contenedor no se conservan en la conversión.

No se admiten las secuencias temporizadas HEIF/AVIF, las composiciones JPEG 2000 (JPX/JPF/JPM) ni Motion JPEG 2000 (MJ2). Las imágenes dañadas o no compatibles generan un error en lugar de una descarga. Las imágenes muy grandes o complejas pueden superar los recursos del navegador o del decodificador; no hay un límite fijo de tamaño de archivo ni de número de imágenes.

## Procesamiento local y descargas

Los archivos permanecen en este dispositivo. Cancela, cierra o reemplaza un archivo para liberar su decodificador y los datos de la descarga actual. Al cambiar la imagen seleccionada, se eliminan los datos de la descarga anterior mientras se prepara la siguiente imagen. El archivo solo se guarda cuando eliges Descargar PNG. El Visor de imágenes también ofrece la misma descarga en PNG de la imagen seleccionada.
