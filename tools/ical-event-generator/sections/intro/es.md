# Crea archivos de calendario sin salir del navegador

Esta herramienta genera archivos de eventos `.ics` estándar directamente en tu navegador. Puedes definir eventos con hora o de todo el día, elegir una estrategia de zona horaria, añadir recordatorios y exportar la entrada final del calendario sin sincronizar datos con un servidor.

## Por qué usarla

- Resulta útil cuando solo necesitas un archivo de calendario y no un flujo completo con una cuenta de calendario.
- Mantiene los horarios sensibles en local y aun así genera un archivo adjunto basado en estándares.
- Permite ajustar reglas de recurrencia y recordatorios antes de descargar el archivo `.ics` final.

## Flujo recomendado

1. Completa el resumen del evento, la ubicación, las notas y la URL de referencia opcional.
2. Elige el rango del evento y decide si exportar marcas de tiempo `UTC` o conservar la zona horaria original con `TZID`.
3. Añade reglas de recurrencia y recordatorios solo si hacen falta, luego descarga el archivo y adjúntalo donde compartas el evento.

## Notas

- La salida en `UTC` suele ser la opción más segura cuando buscas una compatibilidad amplia con calendarios.
- La salida con `TZID` conserva el contexto original de programación para clientes que entienden zonas horarias con nombre.
- En los eventos de todo el día, el formulario mantiene la fecha final como inclusiva aunque el archivo ICS la guarde como fecha final exclusiva.
