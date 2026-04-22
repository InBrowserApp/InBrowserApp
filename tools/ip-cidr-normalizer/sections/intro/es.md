## Qué normaliza esta herramienta

Esta herramienta convierte direcciones IPv4, direcciones IPv6 y rangos CIDR en notación canónica directamente en el navegador. Elimina el relleno innecesario de IPv4, comprime IPv6 al formato abreviado estándar y conserva la familia de direcciones original.

## Cómo funciona la normalización CIDR

Cuando ingresa un bloque CIDR, la herramienta reescribe la dirección en la dirección de red real para ese prefijo. Los bits del host se borran, por lo que `192.168.0.15/24` se convierte en `192.168.0.0/24` y `2001:db8::1234/64` se convierte en `2001:db8::/64`.

## Cuando esto es útil

Úselo antes de comparar reglas de firewall, ACL, tablas de rutas, listas de VPN permitidas o archivos de configuración importados. La entrada normalizada hace que la detección de duplicados, las revisiones y el copiar y pegar en herramientas de red sean más confiables.

## Por qué se puede rechazar la entrada

La herramienta rechaza direcciones IPv4 o IPv6 con formato incorrecto, prefijos CIDR no válidos y combinaciones de direcciones o prefijos que no coinciden con la familia de protocolos. Si el valor no se puede analizar sin ambigüedades, es más seguro rechazarlo que normalizar la red incorrecta.
