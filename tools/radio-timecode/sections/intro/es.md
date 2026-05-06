## Qué hace Sincronización de códigos horarios de radio

Sincronización de códigos horarios de radio genera audio en el navegador que sigue formatos habituales de señales horarias de radio de onda larga: JJY, BPC, DCF77, MSF y WWVB. Es útil cuando un reloj radiocontrolado compatible no puede recibir el transmisor real en interiores, o cuando quieres probar cómo reacciona un reloj ante un formato de estación conocido.

## Cómo usarlo

Selecciona la estación que coincide con el reloj, coloca el altavoz del dispositivo cerca de la zona de la antena del reloj, inicia la señal y deja que el reloj escuche al menos una trama completa de un minuto. Mantén el volumen bajo al principio y súbelo solo si el reloj no detecta la señal.

## Precisión y limitaciones

La hora generada procede del reloj del sistema de este dispositivo más el desfase opcional, así que sincroniza el reloj del dispositivo antes de usar la herramienta. Los navegadores no pueden emitir directamente la portadora real de onda larga; esta herramienta usa una aproximación de onda cuadrada de menor frecuencia que puede funcionar mediante armónicos en algunos dispositivos. El hardware, la colocación del altavoz y el firmware del reloj afectan a los resultados, y el audio de indicativo de JJY se omite intencionadamente.
