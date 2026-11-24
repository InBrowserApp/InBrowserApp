## Cómo conectar un dispositivo Bluetooth Low Energy

Activa Bluetooth y pon el dispositivo en un modo que permita conectarse a él. Selecciona **Conectar dispositivo** y elige el periférico en el navegador. Este explorador solicita acceso a servicios GATT habituales, como los de batería, información del dispositivo, frecuencia cardíaca y detección ambiental. Para un servicio GATT personalizado, introduce su UUID antes de abrir el selector. Usa un UUID de 16 bits como `180F` o uno completo de 128 bits de la documentación del dispositivo.

## Cómo leer características GATT

Despliega un servicio para ver sus características y las operaciones que admite cada una. Selecciona **Leer** para solicitar el valor actual. El formato hexadecimal muestra los bytes exactamente como se recibieron, mientras que UTF-8 es útil para las características que contienen texto. Un nivel de batería, una medición u otro valor binario puede requerir una interpretación según la especificación de esa característica.

## Cómo capturar notificaciones Bluetooth

Selecciona **Suscribirse** en una característica que admita notificaciones o indicaciones. Las actualizaciones aparecen con su hora y el UUID de la característica. Descarga las últimas 100 notificaciones como archivo JSON para examinarlas más adelante, o selecciona **Cancelar suscripción** para detener ese flujo. La página conserva el registro localmente.

## ¿Por qué no puedo ver mi dispositivo o sus servicios?

La compatibilidad con Web Bluetooth depende del navegador y del sistema operativo. Usa un navegador compatible mediante HTTPS, mantén el dispositivo cerca y desconéctalo de otras aplicaciones si solo permite una conexión. El navegador da acceso a los servicios GATT autorizados de los periféricos Bluetooth LE. Los dispositivos Bluetooth Classic, como los auriculares que solo ofrecen perfiles de audio, requieren otra interfaz.
