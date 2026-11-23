## Convierte un PNG animado en GIF

APNG guarda varios fotogramas en un archivo PNG. Convierte la animación a GIF
para usarla en chats, foros o documentación que requieran ese formato. Los
archivos animados pueden acabar en `.apng` o `.png`. El convertidor lee los
fotogramas del archivo y los procesa en tu dispositivo.

### Cómo convertir APNG a GIF

1. Pulsa **Elegir archivo** o arrastra un PNG animado al convertidor.
2. Pulsa **Crear GIF** para convertir los fotogramas con sus dimensiones originales.
3. Pulsa **Reproducir** para comprobar el GIF y **Descargar GIF** para guardarlo.

### ¿Qué pasa con la duración de los fotogramas y los bucles?

El GIF conserva la duración de cada fotograma, redondeada a unidades de 10 ms,
con un mínimo de 20 ms para la reproducción. Por ejemplo, si un fotograma dura
100 ms y el siguiente 250 ms, ambos conservan su duración. El GIF también
conserva el número de reproducciones del original, ya sea una vez, varias veces
o indefinidamente. Para una animación finita, el GIF admite hasta 65.536
reproducciones en total.

### ¿Cómo gestiona GIF la transparencia y el color?

APNG admite transparencia parcial y fotogramas a todo color. GIF usa una paleta
indexada de hasta 256 entradas por fotograma, con una sola entrada transparente.
Los bordes suaves y las sombras pueden verse más marcados, y los degradados
pueden mostrar bandas. Revisa la vista previa del GIF antes de compartirlo. Si
el destino admite PNG animado, el archivo original conserva todos sus colores y
la transparencia parcial.

### Preguntas frecuentes

#### ¿Puedo convertir un PNG normal?

El convertidor requiere datos de animación PNG. Un archivo con extensión `.png`
también puede estar animado. Si la animación incluye una imagen alternativa
para visores de PNG estático, el GIF empieza con el primer fotograma de la
animación.

#### ¿El GIF ocupará menos que el APNG?

El tamaño depende de las dimensiones, el número de fotogramas y el nivel de
detalle. El GIF puede ocupar más, especialmente si el APNG original solo
almacena las pequeñas zonas que cambian entre fotogramas. Consulta el tamaño
junto a la vista previa del GIF.

### Otras herramientas de animación

Usa [GIF a APNG](/es/tools/gif-to-apng-converter/) para hacer la conversión
inversa o [WebP animado a GIF](/es/tools/animated-webp-to-gif-converter/) si
el archivo original es WebP.
