## Cómo usar la terminal serie en el navegador

Conecta tu Arduino, ESP32, Raspberry Pi Pico o adaptador serie USB con un cable de datos. Configura la velocidad en baudios que usa el dispositivo, por ejemplo, 9600 o 115200; después, selecciona **Conectar** y elige su puerto en el navegador. Este monitor serie usa 8 bits de datos, sin paridad, un bit de parada y sin control de flujo (8N1).

## Envío de texto y bytes hexadecimales

El texto se envía en UTF-8. Elige LF, CR o CR + LF si tu dispositivo usa un final de línea para enviar comandos. Para comandos binarios, selecciona **Hexadecimal** e introduce bytes completos, como `41 54 0D 0A`. El formato hexadecimal envía los bytes tal como se introducen, sin añadir un final de línea automático.

## Lectura y almacenamiento de registros serie

El registro muestra los datos recibidos (RX) y enviados (TX) con marcas de tiempo. Cambia a Hexadecimal para examinar cada byte si el texto se ve ilegible. Pausa el desplazamiento para examinar una entrada anterior mientras siguen llegando datos, o descarga el registro conservado como archivo de texto. Los datos serie permanecen en esta pestaña hasta que decidas guardarlos.

## ¿Por qué no puedo conectar mi dispositivo?

Usa un navegador actualizado compatible con Web Serial y asegúrate de que el sistema operativo reconozca el puerto serie. Prueba otro cable y cierra cualquier otro monitor serie que esté usando el puerto. Si el dispositivo se conecta pero produce texto ilegible, comprueba la velocidad en baudios y prueba a visualizar los bytes en formato hexadecimal.
