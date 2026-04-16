## ¿Qué es una dirección IPv6 de enlace local?

Las direcciones IPv6 de enlace local son direcciones IPv6 especiales que se configuran automáticamente en cada interfaz habilitada para IPv6. Siempre comienzan con el prefijo fe80::/10 y se utilizan para la comunicación entre dispositivos en el mismo segmento de red. Estas direcciones no son enrutables más allá del enlace local y se utilizan comúnmente para descubrimiento de vecinos, descubrimiento de enrutadores y otros protocolos de red local. Las direcciones de enlace local se pueden generar a partir de la dirección MAC de un dispositivo utilizando el formato EUI-64.

### Cuándo usarlo

Úsalo cuando necesites la dirección link-local determinista que EUI-64 deriva de la dirección MAC de un dispositivo.

### Cómo funciona el mapeo EUI-64

1. Normaliza la dirección MAC a 48 bits.
2. Invierte el `U/L bit` del primer byte.
3. Inserta `ff:fe` en el centro para crear un identificador de interfaz de 64 bits.
4. Añade el prefijo `fe80::/10` al identificador.

### Formatos de entrada admitidos

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Sufijo de interfaz opcional

Agrega `%eth0`, `%en0` u otro identificador de zona solo cuando un comando local necesite saber qué interfaz debe usar.
