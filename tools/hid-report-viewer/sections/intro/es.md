## Cómo conectar un dispositivo HID en el navegador

Conecta un dispositivo de interfaz humana compatible, como un control de videojuegos, una palanca de mando, un pedal o un teclado de macros. Selecciona **Conectar dispositivo** y elige el dispositivo en el selector de WebHID. El visor muestra el identificador de fabricante (VID) y el identificador de producto (PID), que ayudan a identificar el hardware. Usa un navegador de escritorio compatible mediante HTTPS.

## Cómo leer las colecciones HID y los identificadores de informe

Abre una colección para ver su página de uso, su uso y sus identificadores de informe. La página de uso agrupa funciones relacionadas, mientras que el uso identifica una función dentro de ese grupo. Los informes de entrada contienen datos procedentes del dispositivo, los informes de salida describen datos que un host puede enviar y los informes de características describen la configuración o el estado específicos del dispositivo. El identificador de informe 0 indica que la interfaz no utiliza un identificador de informe explícito.

## Cómo inspeccionar los bytes de entrada que cambian

Mueve un control a la vez mientras observas los informes en hexadecimal en tiempo real. Los bytes resaltados son distintos de los de la carga útil anterior con el mismo identificador de informe. El identificador de informe se muestra separado de la carga útil. Pausa la captura para inspeccionar los informes más recientes o borra la lista para empezar de nuevo. Consulta el formato de informes del dispositivo para interpretar los botones, ejes y demás campos.

## ¿Por qué no aparece mi dispositivo o una colección?

Comprueba que el sistema operativo reconozca el dispositivo y vuelve a abrir el selector. Los navegadores protegen las colecciones comunes de teclado y ratón, y algunos dispositivos solo ponen a disposición de la web una parte de sus informes. Este visor recibe informes de entrada del dispositivo seleccionado y conserva los datos en esta pestaña. Para controles estándar, prueba el [Comprobador de gamepad](../gamepad-tester/) o el [Comprobador de teclado](../keyboard-tester/).
