## Qué hace esta herramienta

Esta herramienta convierte una dirección IP inicial y una dirección IP final en el conjunto más pequeño de bloques CIDR que cubre exactamente el rango completo. Todo se ejecuta localmente en su navegador, por lo que las direcciones nunca salen de su dispositivo.

## Cómo funciona la cobertura CIDR

Un bloque CIDR representa una red de potencia de dos tamaños alineada en un límite coincidente. Cuando un rango comienza o termina en el medio de esos límites, un bloque no es suficiente. El convertidor sigue tomando el bloque alineado más grande que encaja, luego repite hasta cubrir todo el rango.

## Por qué pueden aparecer varios bloques

Rangos como 192.168.1.10 a 192.168.1.25 no comienzan en un límite de red limpio ni terminan en uno tampoco. Por lo tanto, el resultado exacto es una lista corta de bloques, cada uno de los cuales cubre una parte alineada sin incluir direcciones adicionales fuera del rango solicitado.

## Cuando esto es útil

Úselo al preparar reglas de firewall, resúmenes de rutas, entradas de ACL, grupos de seguridad en la nube o listas de verificación de migración donde un rango inicial y final sin formato debe convertirse en notación CIDR estándar.
