## Cómo ver el histograma de una imagen

Elige o arrastra una foto, una captura de pantalla o una ilustración para ver el histograma junto a la imagen. También puedes probar con la foto de ejemplo. Empieza con **Luminosidad** para ver la distribución general de los tonos y cambia a **RGB** para comparar el rojo, el verde y el azul en la misma escala. Selecciona un canal para examinarlo en detalle.

## Cómo interpretar las sombras, los tonos medios y las altas luces

El eje horizontal va del 0 (el tono más oscuro) al 255 (el más claro). A la izquierda están las sombras, en el centro los tonos medios y a la derecha las altas luces. Cuanto más alta sea una barra, más píxeles hay en ese nivel. Pasa el puntero sobre el gráfico, toca el nivel que te interese o ajusta el control de nivel con las teclas de flecha para consultar el número exacto de píxeles.

Un pico en un extremo puede indicar un recorte de sombras o de altas luces y, por tanto, una posible pérdida de detalle. Por ejemplo, un pico en 255 en el canal rojo puede revelar que ese canal está recortado aunque el histograma de luminosidad aún tenga margen a la derecha. Un fondo blanco puro también puede producir un pico en un extremo. Consulta la vista previa para interpretarlo. Los indicadores **Sombras** y **Altas luces** muestran el porcentaje de píxeles analizados que están exactamente en los niveles 0 y 255, respectivamente.

## Cuándo usar una escala logarítmica

Usa la escala **Lineal** para que la altura de cada barra sea proporcional al número de píxeles. Prueba la escala **Logarítmica** cuando una zona extensa de un solo color dificulte la lectura del resto del histograma. La escala cambia la altura de las barras y conserva el recuento de píxeles de cada nivel.

## Qué mide el visor

El visor cuenta los píxeles de la imagen de 8 bits que renderiza el navegador, a su tamaño original. La luminosidad se calcula combinando los valores de rojo, verde y azul, con mayor peso para el verde. Los píxeles completamente transparentes se omiten y cada píxel parcialmente transparente se cuenta una vez, aunque el navegador puede redondear sus valores RGB al renderizar la imagen. En una imagen animada se analiza un solo fotograma. Las imágenes se procesan en tu dispositivo.
