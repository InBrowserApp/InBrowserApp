## Convierte una imagen a JPG

Abre una imagen local, elige la calidad JPG y un color de fondo, inspecciona la vista previa del resultado comprimido y descarga la imagen seleccionada. La salida conserva sus dimensiones completas en píxeles y la orientación aplicada. El zoom y los fondos de la vista previa no cambian el tamaño ni los colores de la imagen guardada.

## Formatos y selección de imágenes

Lee JPEG, PNG, GIF, BMP, WebP, imágenes estáticas AVIF, TIFF, ICO, imágenes estáticas y colecciones HEIC/HEIF, JPEG XL, JP2 y flujos de código JPEG 2000 (J2K). Se comprueba el contenido del archivo en lugar de confiar en su extensión. La compatibilidad depende de la codificación interna del archivo. Usa los convertidores específicos de SVG para las imágenes vectoriales SVG.

En los archivos que contienen varias imágenes, selecciona la página TIFF, el tamaño del icono, la imagen de la colección o el fotograma de animación antes de descargar. Cada descarga es un JPG estático, con el número de página o fotograma incluido en el nombre del archivo. Los fotogramas GIF, WebP animado y JPEG XL se recomponen en imágenes completas. Los PNG animados solo exportan su imagen estática predeterminada, identificada como póster; no se pueden exportar otros fotogramas ni la animación.

## Calidad, transparencia y color

JPG usa compresión con pérdida, incluso al convertir un JPEG existente. Elige una calidad de 1 a 100; una mayor calidad suele generar un archivo más grande, y el valor 100 sigue teniendo pérdida. La vista previa muestra el contenido exacto que se descargará. Al cambiar la calidad o el fondo JPG, se prepara una nueva vista previa de la imagen seleccionada.

JPG no admite transparencia. Los píxeles transparentes se rellenan con blanco, negro o el color de fondo JPG personalizado. La salida usa color sRGB de 8 bits; los perfiles incrustados del archivo de origen se usan para la conversión cuando son compatibles. Se reducen la alta profundidad de bits y el HDR, y los colores pueden diferir de los de un editor con gestión del color. No se conservan las imágenes auxiliares, los mapas de profundidad ni los metadatos del contenedor.

## Procesamiento local y límites

Los archivos permanecen en este dispositivo. Cancela, cierra o reemplaza un archivo para liberar su decodificador y los datos de la descarga actual. El archivo solo se guarda cuando eliges Descargar JPG. El Visor de imágenes también ofrece exportación a JPG con los mismos ajustes de calidad y fondo.

No se admiten las secuencias temporizadas HEIF/AVIF, las composiciones JPEG 2000 (JPX/JPF/JPM) ni Motion JPEG 2000 (MJ2). Las imágenes dañadas o no compatibles generan un error en lugar de una descarga. Las imágenes muy grandes o complejas pueden superar los recursos del navegador o del decodificador; no hay un límite fijo de tamaño de archivo ni de número de imágenes.
