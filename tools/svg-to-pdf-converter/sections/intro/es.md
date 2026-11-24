## Cómo convertir SVG a PDF

1. Arrastra un archivo `.svg` al convertidor o selecciona **Elegir SVG**. Selecciona **Probar un ejemplo** para ver cómo funciona la exportación.
2. Revisa la vista previa del SVG. Mantén **Tamaño original del SVG** si quieres que la página tenga las mismas dimensiones que el lienzo del logotipo, icono o ilustración. Si necesitas un formato de papel estándar, elige **A4** o **Carta (EE. UU.)**.
3. Selecciona **Descargar PDF** para guardar un PDF de una página con el mismo nombre base que el SVG. La conversión se hace en tu navegador y el archivo SVG permanece en tu dispositivo.

## ¿Qué elementos conservan el formato vectorial en el PDF?

Los trazados, las formas, los rellenos y los contornos se dibujan directamente en el PDF. Así, los logotipos, los diagramas y los dibujos lineales conservan su nitidez al ampliarlos o imprimirlos. Las imágenes de mapa de bits incrustadas en un formato compatible, como una foto PNG, conservan su resolución original. Antes de compartir el PDF, puedes ampliarlo para revisar las líneas finas y las curvas.

## ¿Cómo se determina el tamaño de página del PDF?

**Tamaño original del SVG** usa las dimensiones del lienzo o las calcula a partir de su `viewBox`. La conversión aplica la proporción estándar de 96 píxeles SVG por pulgada. Por ejemplo, un SVG de 960 × 480 px genera una página PDF de 10 × 5 pulgadas. **A4** y **Carta (EE. UU.)** centran el diseño con márgenes, conservan sus proporciones y adaptan la orientación de la página a la del diseño.

## ¿Por qué mi PDF se ve diferente de la vista previa del SVG?

La vista previa del SVG se dibuja con el motor del navegador. El motor que genera el PDF admite los elementos vectoriales habituales, aunque las fuentes personalizadas, los filtros, las máscaras y otros efectos pueden verse distintos o no aparecer. Los recursos externos se omiten. Para conservar mejor la tipografía y el color, convierte el texto en trazados en tu editor de diseño, incrusta las imágenes PNG o JPEG, simplifica los efectos complejos y revisa el PDF descargado antes de imprimirlo.
