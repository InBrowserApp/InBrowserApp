## Qué muestra este visor

El Visor de información multimedia lee los metadatos técnicos de archivos locales
de audio y vídeo, incluidos MP4, MOV, MKV, WebM, AVI, MP3, FLAC y WAV. Úsalo para
comprobar las especificaciones de un archivo exportado, consultar las etiquetas
de idioma de las pistas de audio de una película o recopilar un informe técnico
para resolver problemas. El análisis comienza en cuanto eliges o arrastras un archivo.

## Detalles del archivo y de las pistas de vídeo, audio y subtítulos

- **Resumen del archivo:** formato real del contenedor, tamaño del archivo,
  duración, tasa de bits total, título y aplicación de codificación, cuando estén disponibles.
- **Pistas de vídeo:** códec, perfil y tasa de bits, resolución, fotogramas por
  segundo y modo de frecuencia de fotogramas, relación de aspecto, rotación,
  profundidad de bits, espacio de color, submuestreo de crominancia y formato HDR.
- **Pistas de audio:** códec, tasa de bits, idioma, título de la pista, número y
  distribución de canales, frecuencia de muestreo, profundidad de bits e indicadores
  de pista predeterminada o forzada. Cada pista de audio aparece por separado,
  para distinguir el sonido original, el doblaje y las pistas de comentarios.
- **Pistas de subtítulos:** formato, idioma, título, duración e indicadores de
  pista predeterminada o forzada, si están incluidos en el archivo.

Las especificaciones principales se muestran de inmediato. Abre **Detalles técnicos**
dentro de una pista para ver campos adicionales, o selecciona un enlace con el número
de pistas para ir a la primera pista de ese tipo. Los campos disponibles dependen
del formato y de sus metadatos.

## Cómo examinar un archivo

1. Elige un archivo local de audio o vídeo, o arrástralo al área de archivos.
2. Revisa el resumen y examina las pistas de vídeo, audio y subtítulos por separado.
3. Copia el informe legible para incluirlo en un mensaje o una solicitud de soporte,
   o descarga JSON para un inventario de archivos multimedia, un script o un análisis
   posterior. Ambos incluyen campos técnicos que aparecen contraídos en la interfaz.
4. Elige **Cambiar archivo** para examinar otro archivo o **Quitar archivo** para
   borrar los resultados. Seleccionar otro archivo o quitar el actual también
   detiene cualquier análisis que siga en curso.

## Cómo interpretar las cifras

- **El contenedor y el códec describen cosas distintas.** MP4 y Matroska son
  contenedores; AVC/H.264, HEVC/H.265 y AAC describen cómo se codifican los flujos.
  Un contenedor puede incluir varias pistas de audio o subtítulos.
- **La tasa de bits total abarca todo el archivo.** Incluye todos los flujos y los
  datos adicionales del contenedor. La tasa de bits de una pista se aplica solo
  a ese flujo. Las tasas de bits se expresan en kb/s o Mb/s; los tamaños de archivo,
  en B, KiB, MiB, GiB o TiB.
- **La duración incluye milisegundos.** Se muestra con el formato `HH:MM:SS.mmm`.
  La frecuencia de fotogramas se expresa en fps y la frecuencia de muestreo del
  audio, en kHz. CFR indica una frecuencia de fotogramas constante; VFR indica
  una frecuencia de fotogramas variable.
- **Los indicadores de pista describen cómo se prevé seleccionarla.** El indicador
  de pista predeterminada señala una pista preferida; el de pista forzada se suele
  usar para subtítulos que deben aparecer sin seleccionar una pista de subtítulos
  completa. Son indicadores independientes que se leen del archivo.

Algunos contenedores no proporcionan una tasa de bits separada para cada flujo.
Los valores que no están disponibles se omiten o se marcan como no disponibles;
no se deducen del nombre del archivo. Las imágenes de portada incrustadas no se
cuentan como pistas de vídeo.

## Usos habituales

Comprueba la resolución y los fotogramas por segundo después de exportar un vídeo,
examina los canales y la frecuencia de muestreo antes de editar audio, identifica
varias pistas de idioma o de comentarios, o recopila detalles del códec al investigar
un problema de reproducción. El informe te permite compartir las especificaciones
pertinentes sin enviar el archivo multimedia.

## Procesamiento local y exportación de informes

El análisis se realiza en tu navegador: el archivo multimedia no se sube y su
contenido no se modifica. El analizador lee segmentos del archivo según sea
necesario, por lo que puede examinar los metadatos incluso cuando el navegador
no puede reproducir el contenedor o el códec.

**Copiar informe** genera un resumen de texto legible. **Descargar JSON** exporta
los metadatos que devuelve el analizador, junto con el nombre y el tamaño del
archivo. En JSON, `Duration` se expresa en segundos, `BitRate` y `OverallBitRate`,
en bits por segundo, y `SamplingRate`, en hercios. La interfaz convierte estos
valores a unidades más fáciles de leer. La exportación también conserva campos
de metadatos adicionales que no se muestran en las tarjetas de las pistas.
