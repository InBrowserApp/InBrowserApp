## ¿Qué es una dirección local única (ULA) de IPv6?

Una dirección local única (ULA) de IPv6 está destinada a la comunicación dentro de sitios, redes privadas y organizaciones conectadas. El espacio ULA completo es `fc00::/7`. Su octavo bit es el **bit L**: el valor `1` selecciona el rango `fd00::/8` asignado localmente que usa este generador, mientras que la mitad `fc00::/8` permanece reservada para otro método de asignación.

Las ULA no son accesibles globalmente de forma predeterminada, pero «local» no significa secreto ni seguro automáticamente. Pueden atravesar límites de sitios enrutados, VPN e interconexiones privadas cuando los operadores configuran esas rutas.

## Cómo construye un /48 este generador conforme a RFC 4193

Este generador conforme a RFC 4193 solicita exactamente 40 bits aleatorios a Web Crypto API y los combina con `fd`. El resultado es un prefijo de sitio de 48 bits estadísticamente único, como `fd12:3456:789a::/48`. La generación se realiza en el navegador: no recopila ninguna dirección MAC, marca de tiempo, identificador del dispositivo ni respuesta de un servidor.

Hay `2^40` ID globales posibles, unos 1,1 billones. La aleatoriedad segura hace improbable la reutilización accidental, pero no puede garantizar que dos prefijos generados de forma independiente nunca coincidan. Registra el `/48` elegido en la documentación de tu red y reutilízalo de forma coherente.

## Planificación de las 65.536 subredes /64 disponibles

Después del prefijo de sitio `/48` viene un ID de subred de 16 bits. Los valores desde `0000` hasta `ffff` proporcionan 65.536 redes `/64` posibles. Por ejemplo, el ID de subred `00a0` convierte `fd12:3456:789a::/48` en la red canónica `fd12:3456:789a:a0::/64`.

Los 64 bits restantes corresponden al ID de interfaz. Esta herramienta solo planifica prefijos de red; no genera direcciones de host `/128` ni deriva identificadores de interfaz a partir de direcciones MAC.

## Dónde deben usarse las ULA y dónde no

Las ULA funcionan bien para el direccionamiento interno estable, los sitios conectados por VPN, las redes de laboratorio y los servicios que deben conservar un prefijo interno mientras usan también IPv6 unicast global. No son un firewall ni un límite de seguridad inherente. Aplica los controles de acceso habituales, filtra el tráfico ULA inapropiado en los límites del sitio y evita publicar registros ULA internos en el DNS público.

Un host puede usar una ULA y una dirección unicast global al mismo tiempo. Usa la dirección global para acceder a Internet y el prefijo ULA duradero para las rutas privadas que lo necesiten.
