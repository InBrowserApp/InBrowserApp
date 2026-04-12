## Para que sirve esta herramienta

Usa esta herramienta para comparar el reloj de tu dispositivo con una hora
obtenida de la red. Consulta una marca de tiempo del endpoint de trazas de
Cloudflare, estima el punto medio de la latencia y muestra el reloj de red en
tu navegador.

## Donde ayuda

- Comprobar si el reloj local del sistema va adelantado o atrasado.
- Confirmar la deriva horaria antes de revisar TLS, tokens, programadores o
  registros.
- Obtener una hora de referencia basada en la red sin instalar herramientas
  NTP.

## Que debes tener en cuenta

- El desfase mostrado es una estimacion y depende de la latencia de red.
- Si falla la solicitud de trazas, la herramienta vuelve a mostrar tu reloj
  local hasta la siguiente sincronizacion correcta.
- Para una correccion precisa a nivel del sistema, ajusta la sincronizacion de
  hora del dispositivo o la configuracion de NTP.
