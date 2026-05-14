La búsqueda inversa de IP convierte una dirección IPv4 o IPv6 en su nombre DNS inverso y consulta el registro `PTR` correspondiente. Ayuda a comprobar qué nombre de host publica el propietario de una dirección para servidores de correo, dispositivos de red, instancias en la nube y notas de solución de problemas.

## Qué comprueba

Para IPv4, la herramienta invierte los octetos y consulta un nombre `in-addr.arpa`. Para IPv6, expande la dirección a 32 dígitos hexadecimales, los invierte y consulta el nombre `ip6.arpa` correspondiente. El resultado muestra el dominio DNS inverso exacto, el código de estado DNS, el resolutor, la familia de direcciones y cualquier nombre de host devuelto con sus valores TTL.

## Cómo se ejecuta la consulta

La búsqueda se ejecuta desde su navegador usando DNS-over-HTTPS. Puede elegir Cloudflare, Google o AliDNS como resolutor, y el navegador envía una consulta `PTR` estándar a ese endpoint. No interviene ningún servicio de búsqueda de InBrowser.App del lado del servidor.

## Cómo interpretar resultados faltantes

Es común que falte una respuesta PTR. Muchas direcciones residenciales, en la nube, privadas o asignadas recientemente no publican registros DNS inversos. Una respuesta DNS correcta sin nombres de host no demuestra que la dirección no se use; solo significa que la zona inversa no devolvió un registro `PTR` utilizable mediante el resolutor seleccionado.

## Notas prácticas

- El DNS inverso asigna una dirección IP a un nombre de host; es distinto de encontrar todos los dominios alojados en la misma dirección.
- Los registros PTR los controla el propietario de la dirección IP o el proveedor ascendente, no solo el propietario del dominio.
- Los sistemas de correo y seguridad suelen comparar el DNS directo e inverso, por lo que un registro PTR normalmente debería apuntar a un nombre de host que resuelva de nuevo a la misma dirección.
