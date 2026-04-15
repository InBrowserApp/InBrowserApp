## ¿Qué es una dirección IPv6 de enlace local?

Las direcciones IPv6 de enlace local son direcciones IPv6 especiales que se configuran automáticamente en cada interfaz habilitada para IPv6. Siempre comienzan con el prefijo fe80::/10 y se utilizan para la comunicación entre dispositivos en el mismo segmento de red. Estas direcciones no son enrutables más allá del enlace local y se utilizan comúnmente para descubrimiento de vecinos, descubrimiento de enrutadores y otros protocolos de red local. Las direcciones de enlace local se pueden generar a partir de la dirección MAC de un dispositivo utilizando el formato EUI-64.

### Formatos de entrada

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Salida EUI-64

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Sufijo de interfaz

- `%eth0`
- `%en0`
- `%wlan0`
