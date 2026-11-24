## Cómo conectar un teclado o controlador MIDI

Conecta un dispositivo MIDI y comprueba que el sistema operativo lo reconozca. Selecciona **Activar MIDI**, concede el permiso MIDI al navegador si te lo solicita y elige una entrada. Usa un navegador compatible a través de HTTPS. El monitor escucha la entrada seleccionada y muestra los mensajes localmente.

## Cómo probar notas y velocidad

Pulsa una tecla o pad y observa el piano y el registro de mensajes. Note On muestra la nota y su velocidad, normalmente un valor entre 1 y 127. Note Off o un Note On con velocidad 0 libera la nota. El teclado identifica la nota MIDI 60 como C4. Cambia la octava inicial para ver otro rango. Las notas mantenidas aparecen en la lista incluso si están fuera del rango mostrado.

## Cómo inspeccionar CC, pitch bend y reloj MIDI

Mueve un potenciómetro, fader o pedal para ver su número y valor de cambio de control (CC). Por ejemplo, muchos pedales de sustain envían CC 64. Pitch Bend se muestra alrededor de un valor central de 0. Los pulsos de reloj MIDI se cuentan por separado del registro de mensajes. Un reloj MIDI estándar envía 24 pulsos por negra. El registro incluye los números de canal y los bytes hexadecimales sin procesar para inspeccionar cada mensaje.

## ¿Por qué no responde mi entrada MIDI?

Comprueba el cable, la alimentación y el modo del dispositivo, y confirma que el puerto seleccionado corresponda al controlador. Cierra otras aplicaciones que puedan estar usando la entrada y vuelve a conectarla. La compatibilidad depende del navegador y del sistema operativo. Esta herramienta escucha mensajes MIDI estándar con acceso MIDI normal. Los mensajes System Exclusive (SysEx) específicos de cada dispositivo requieren un permiso adicional.
