## Generar un prefijo ULA IPv6 /48

Copia el prefijo `fd` generado para tu red doméstica, laboratorio o VPN. Guarda el `/48` elegido con la configuración de red para reutilizarlo al añadir subredes. Pulsa **Generar nuevo prefijo** si quieres una nueva asignación.

## Calcular una subred /64

Introduce un **ID de subred** hexadecimal de `0000` a `ffff`. Por ejemplo, el ID `00a0` dentro de `fd12:3456:789a::/48` da `fd12:3456:789a:a0::/64`. Un `/48` admite 65.536 subredes `/64`, así que puedes asignar prefijos distintos a la LAN, la red Wi-Fi de invitados y la VPN.

## De dónde viene el prefijo fd

RFC 4193 define las direcciones locales únicas en `fc00::/7`. La mitad asignada localmente, `fd00::/8`, empieza por `fd`. El generador añade un ID global aleatorio de 40 bits obtenido con la API Web Crypto del navegador para formar el `/48`.

## Cuándo usar una dirección local única

Usa una ULA para tener un direccionamiento IPv6 estable dentro de una red o entre sitios conectados por VPN. Un dispositivo también puede usar una dirección IPv6 global para el tráfico de Internet público y conservar su ULA para los servicios internos.
