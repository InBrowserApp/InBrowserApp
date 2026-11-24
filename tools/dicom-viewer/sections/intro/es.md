## Cómo abrir archivos DICOM

Selecciona **Abrir archivos DICOM** o arrastra uno o varios archivos al visor. Para recorrer una serie de tomografía computarizada (TC) o resonancia magnética (RM), selecciona todas sus imágenes. Si los archivos incluyen varias series, usa el selector **Serie** para cambiar entre ellas. Puedes abrir archivos con extensión `.dcm` o `.dicom`, o incluso sin extensión.

Usa la rueda del ratón sobre la imagen, selecciona el área de imagen con el teclado y pulsa la flecha arriba o abajo, o usa el control deslizante y los botones de corte. Selecciona **Probar un ejemplo** para explorar una serie de TC sintética antes de abrir tus propios archivos.

## Cómo ajustar el ancho y el nivel de ventana

El ancho de ventana determina qué intervalo de grises se muestra. Al reducir el ancho, aumenta el contraste dentro de ese intervalo. El nivel de ventana, también llamado centro de ventana, desplaza ese intervalo y cambia la luminosidad de la imagen. Introduce los valores en **Ajustes de ventana** o arrastra sobre la imagen en horizontal para cambiar el ancho y en vertical para cambiar el nivel. Selecciona **Restablecer** para recuperar los ajustes iniciales del corte actual.

## Cómo consultar los metadatos DICOM

Abre **Metadatos** para consultar las etiquetas del archivo actual, como la modalidad, la descripción de la serie y las dimensiones de la imagen, si están disponibles. Busca por número de etiqueta, nombre del atributo o valor. En un archivo con varios fotogramas, la tabla muestra los atributos comunes a todo el archivo. Los metadatos pueden contener información que permita identificar a una persona. Los archivos y sus etiquetas se procesan en este dispositivo, sin subirlos a ningún servidor.

## Imágenes DICOM compatibles

El visor abre imágenes DICOM en escala de grises con datos de píxel sin comprimir o comprimidos con JPEG sin pérdidas, incluidos los archivos con varios fotogramas. DICOM es un formato contenedor. La posibilidad de mostrar una imagen depende de cómo se hayan codificado sus píxeles. Si la imagen usa otra codificación, como JPEG 2000, expórtala como DICOM sin compresión desde el programa de imagen médica original. El visor sirve para consultar archivos e imágenes. Para realizar diagnósticos, usa una estación de trabajo clínica.
