## Convierte un WebP animado en GIF

El WebP animado almacena varios fotogramas en un solo archivo `.webp`.
Conviértelo a GIF si vas a usarlo en un chat, un sitio de documentación o
cualquier otro destino que requiera GIF para las animaciones. Puedes convertir
WebP animados con o sin pérdida. El procesamiento se realiza en tu dispositivo.

### Cómo convertir WebP animado a GIF

1. Pulsa **Elegir archivo** o arrastra un WebP animado al convertidor.
2. Pulsa **Crear GIF** para convertir los fotogramas con sus dimensiones originales.
3. Pulsa **Reproducir** para comprobar el GIF y **Descargar GIF** para guardarlo.

### ¿Qué pasa con la duración de los fotogramas y los bucles?

El GIF conserva la duración de cada fotograma, redondeada a unidades de 10 ms,
con un mínimo de 20 ms para la reproducción. Por ejemplo, si un fotograma dura
100 ms y el siguiente 250 ms, ambos conservan su duración. El GIF mantiene el
número total de reproducciones configurado en el WebP. Si el WebP se reproduce
indefinidamente, el GIF también.

### ¿Cómo gestiona GIF la transparencia y el color?

GIF usa una paleta indexada de hasta 256 entradas por fotograma, con una sola
entrada transparente. WebP admite transparencia parcial, por lo que las
sombras translúcidas y los bordes suavizados pueden verse distintos en el GIF.
Los fotogramas con muchos colores también pueden mostrar bandas. Comprueba la
vista previa con el fondo que vayas a usar.

### Preguntas frecuentes

#### ¿Puedo convertir un WebP estático?

Esta herramienta requiere fotogramas de animación. Tanto las imágenes estáticas
como las animadas pueden tener la extensión `.webp`. Para crear una animación a
partir de varias imágenes estáticas, usa el
[Creador de GIF](/es/tools/gif-maker/).

#### ¿Por qué ocupa más el GIF que el WebP?

WebP comprime de forma eficiente los colores y las zonas que cambian entre
fotogramas. El GIF puede ocupar más aunque tenga las mismas dimensiones y
duraciones. Si el sitio de destino limita el tamaño de los archivos, consulta
el tamaño junto a la vista previa.

### Otras herramientas de animación

Usa [GIF a WebP animado](/es/tools/gif-to-animated-webp-converter/) para hacer
la conversión inversa o [APNG a GIF](/es/tools/apng-to-gif-converter/) si
el archivo original es un PNG animado.
