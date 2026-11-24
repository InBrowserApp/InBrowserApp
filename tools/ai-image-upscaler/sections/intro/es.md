## Cómo ampliar una imagen con IA

1. Elige una imagen JPG, PNG o WebP, o arrástrala a la zona de selección. Usa la mejor copia que tengas, aunque sea pequeña.
2. Selecciona **2×** o **4×** y comprueba las dimensiones de salida. Una imagen de 400 × 300 pasa a 800 × 600 con 2×, o a 1600 × 1200 con 4×.
3. Selecciona **Ampliar imagen** y mueve el control de comparación para examinar los bordes y las texturas. Descarga el resultado en PNG sin pérdida.

## ¿Qué es la superresolución de imágenes con IA?

La superresolución aumenta las dimensiones en píxeles de una imagen de baja resolución. InBrowser.App usa Real-ESRGAN, un modelo entrenado para estimar bordes más definidos y texturas más finas a partir de los píxeles disponibles. Puede mejorar la nitidez al ampliar fotos pequeñas, ilustraciones e imágenes web comprimidas. Revisa los rostros, las letras pequeñas y los patrones finos en la vista previa. Los detalles añadidos son estimaciones y pueden diferir de la escena original.

## ¿Cuándo conviene ampliar a 2× o a 4×?

Elige 2× para una ampliación moderada, por ejemplo, para reutilizar una miniatura en un diseño más grande. Elige 4× si la imagen debe ocupar mucho más espacio, como cuando quieres mostrar a mayor tamaño un escaneo pequeño. Al duplicar cada lado, obtienes cuatro veces más píxeles. Al cuadruplicarlo, obtienes dieciséis veces más. La imagen original puede tener hasta 2048 píxeles por lado y 1 megapíxel en total.

## ¿La ampliación se realiza en mi dispositivo?

Sí. El navegador descarga el modelo Real-ESRGAN la primera vez que inicias una ampliación. Procesa la imagen en tu dispositivo con WebGPU cuando está disponible y puede usar la CPU mediante WebAssembly. El primer uso puede tardar más. El tiempo de procesamiento depende del tamaño de la imagen y de tu dispositivo. La imagen se queda en tu dispositivo durante todo el proceso.
