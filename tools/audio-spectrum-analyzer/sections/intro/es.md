## Examina las frecuencias de un archivo de audio

Usa el analizador de espectro de audio para localizar un zumbido grave, comparar el contenido en frecuencias de varios archivos o ver dónde una grabación pierde frecuencias altas. La gráfica muestra la frecuencia en hercios (Hz) y el nivel en decibelios respecto al máximo de la escala digital (dBFS). Los picos indican qué bandas de frecuencia concentran más energía en la grabación.

## Cómo visualizar el espectro de audio

1. Elige o arrastra un archivo mono o estéreo en WAV, MP3, M4A, FLAC u OGG. Los formatos que se pueden decodificar dependen del navegador.
2. Localiza la frecuencia dominante. Después, coloca el puntero sobre la gráfica o tócala para consultar otra frecuencia y su nivel. El control deslizante te permite consultar los mismos valores con el teclado.
3. Alterna entre las escalas logarítmica y lineal según lo que quieras examinar. Reproduce el archivo original mientras consultas la gráfica. Tanto el análisis como la reproducción se realizan en tu dispositivo.

## Cómo interpretar la gráfica FFT

La herramienta decodifica el audio a 48 kHz y utiliza una transformada rápida de Fourier (FFT) para analizar fragmentos breves distribuidos a lo largo del archivo. Aplica una ventana de Hann a cada fragmento. Promedia la potencia de los fragmentos y combina por potencia los canales estéreo, por lo que los sonidos desfasados entre canales siguen apareciendo. La gráfica llega hasta 24 kHz. Los niveles corresponden a intervalos individuales de frecuencia y difieren del volumen global, del nivel de pico de las muestras y de la sonoridad integrada en LUFS.

Un pico estrecho cerca de 50 o 60 Hz puede indicar un zumbido eléctrico. Una caída brusca en las frecuencias altas puede deberse al filtrado o a la compresión. Un pico aislado puede corresponder a un armónico. Revisa los picos cercanos antes de usarlo para identificar la altura de una nota.

## ¿Cuándo conviene usar la escala logarítmica o la lineal?

La escala logarítmica deja más espacio para las frecuencias graves y medias y facilita seguir las octavas. En la escala lineal, las diferencias iguales en Hz ocupan la misma distancia. Esto ayuda a comparar armónicos separados por intervalos iguales. Esta gráfica resume el contenido en frecuencias de toda la grabación. Para saber cuándo aparece un sonido o cómo cambia su frecuencia con el tiempo, consulta un espectrograma.
