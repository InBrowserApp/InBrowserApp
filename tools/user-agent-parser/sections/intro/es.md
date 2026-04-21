## ¿Qué es un User-Agent?

Una cadena User-Agent (UA) identifica el navegador o la app que realiza una solicitud y suele incluir navegador, SO, dispositivo y motor. Como puede falsificarse, úsala como pista y no como señal de seguridad.

### Qué muestra este analizador

Esta herramienta analiza localmente en tu navegador la cadena UA pegada y organiza el resultado en navegador, sistema operativo, motor, dispositivo, CPU y salida JSON. No se sube nada.

### Ejemplo

Pega una cadena común de Chrome en Windows como esta:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

El resultado debería identificar Chrome 115 en Windows 10, con motor Blink y arquitectura de CPU amd64.

### Importante

Los navegadores modernos dependen cada vez más de Client Hints, así que una cadena UA copiada puede no mostrar todo lo que un sitio ve durante una solicitud real.
