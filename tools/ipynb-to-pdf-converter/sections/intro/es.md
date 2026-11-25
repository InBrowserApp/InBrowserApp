## Cómo convertir un notebook de Jupyter a PDF

Abre o arrastra un archivo `.ipynb` guardado en Jupyter, Google Colab o VS Code. Revisa la vista previa, elige A4 o US Letter y selecciona **Guardar como PDF**. En el cuadro de impresión del navegador, elige **Guardar como PDF** como destino. También puedes elegir una impresora. Por ejemplo, `analysis.ipynb` se convierte en un PDF que puedes adjuntar a un correo o entregar con un informe.

## Qué incluye el PDF

El PDF sigue el orden de las celdas del notebook. Incluye encabezados y tablas de Markdown, código fuente y salidas guardadas compatibles, como texto de consola, tablas e imágenes de gráficos incrustadas. Las líneas largas de código se ajustan al papel. Las celdas largas pueden continuar en otra página y el texto sigue siendo seleccionable en el navegador.

Guarda el notebook con sus salidas antes de convertirlo si quieres los resultados más recientes. El conversor lee el archivo guardado localmente y nunca ejecuta celdas. Los widgets necesitan una representación estática guardada para aparecer. El código LaTeX permanece como texto y no se descargan imágenes remotas ni otros recursos externos.

## Otras formas de usar el notebook

Usa el [visor de Jupyter Notebook](../notebook-viewer/) para leer las celdas y salidas guardadas de forma interactiva. Usa el [conversor de Jupyter Notebook](../notebook-export/) si necesitas HTML, Markdown o un script de código.
