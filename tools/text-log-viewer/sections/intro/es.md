## Lee texto y registros de forma local

Abre un archivo .txt, .text o .log para leerlo con números de línea, tamaño de texto ajustable, ajuste de línea opcional y lectura sin distracciones. Salta a una línea, ve al principio o al final, o usa Buscar texto para buscar en todo el archivo. La búsqueda es literal y distingue mayúsculas y minúsculas; al llegar a un extremo, las búsquedas siguiente y anterior continúan desde el extremo opuesto.

## Archivos grandes y líneas largas

El visor muestra una sección a la vez para facilitar la lectura de archivos grandes. Todas las secciones siguen siendo accesibles, incluida la continuación de las líneas muy largas. La selección y el comando de búsqueda de tu navegador abarcan la sección actual; Buscar texto del visor busca en todo el archivo decodificado, incluidas las coincidencias que atraviesan los límites entre secciones. No se impone ningún límite de tamaño de archivo ni de número de líneas. La memoria disponible en el navegador sigue estableciendo un límite práctico.

Se conservan las líneas en blanco, las tabulaciones, los finales de línea CRLF/CR/LF mixtos y el texto Unicode. Los finales de línea se muestran como saltos de línea. El marcado y las secuencias de escape de terminal se mantienen como texto inerte. Algunos caracteres de control no tienen una representación visible; los archivos que contienen caracteres NUL reciben un aviso de archivo binario.

## Elige la codificación adecuada

El modo automático reconoce las marcas de orden de bytes UTF-8 y UTF-16 y, en los demás casos, usa UTF-8 estricto. Puedes elegir UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 o Shift JIS. Un error de decodificación detiene la vista previa en lugar de sustituir los caracteres ilegibles sin avisar. Prueba otra codificación si el archivo es ilegible o muestra caracteres incorrectos; el visor no puede determinar la codificación original de todos los archivos.

Los archivos se procesan en tu dispositivo sin subidas, recursos remotos ni almacenamiento automático. Al cerrar o reemplazar un archivo, se libera su sesión de lectura. Este visor no edita archivos, no interpreta HTML ni comandos de terminal y no sigue registros en tiempo real.
