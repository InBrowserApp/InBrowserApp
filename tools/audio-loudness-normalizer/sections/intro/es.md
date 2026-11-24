## Normaliza el audio a un nivel objetivo en LUFS

Iguala la sonoridad percibida de episodios de pódcast, locuciones y pistas musicales. El normalizador mide la sonoridad integrada de toda la grabación y aplica el mismo ajuste de ganancia a todos los canales. Así se conserva la diferencia de nivel entre los pasajes suaves y los más intensos. Elige un ajuste preestablecido o introduce el valor en LUFS que requiere tu proyecto.

## Cómo normalizar un archivo de audio

1. Elige o arrastra una grabación mono o estéreo. Los formatos habituales incluyen WAV, MP3, M4A, FLAC y OGG. Los códecs disponibles dependen de tu navegador.
2. Selecciona un objetivo como −16 LUFS para pódcast, −14 LUFS para música o −23 LUFS para radiodifusión. Los requisitos de publicación pueden variar. Si tienes una especificación de entrega, usa un objetivo personalizado.
3. Compara los valores originales con los normalizados, escucha el resultado y descarga un WAV de 16 bits a 48 kHz. La decodificación, el análisis y la exportación se realizan en tu dispositivo.

## ¿En qué se diferencian los LUFS y el pico real?

La sonoridad integrada en LUFS estima cómo se percibe la intensidad de toda la grabación. Para ello, pondera las frecuencias y descarta los tramos que quedan por debajo de un umbral de sonoridad. El pico real, expresado en dBTP, estima el nivel máximo que puede alcanzar la señal reconstruida entre muestras. Dos pistas pueden tener picos similares y una sonoridad muy distinta. Por eso, igualar solo los picos suele hacer que una de ellas se oiga más baja.

## ¿Por qué el resultado queda por debajo del objetivo?

Un transitorio breve puede alcanzar el límite de −1 dBTP antes de que la sonoridad global llegue al objetivo. En ese caso, la herramienta reduce la ganancia y muestra el nivel que puede alcanzar. Para obtener un máster con más sonoridad y el mismo margen, controla los picos más altos en tu editor de audio antes de normalizar. Es posible que un archivo silencioso no tenga una sonoridad integrada medible.
