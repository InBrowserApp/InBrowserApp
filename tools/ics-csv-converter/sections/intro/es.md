## Exportar eventos de calendario ICS a CSV

Elige **De ICS a CSV**, abre o pega un archivo iCalendar y selecciona **Convertir**. La hoja de cálculo contiene una fila por registro de evento e incluye el título, el inicio, el fin, la ubicación, la descripción y, si existe, la regla de recurrencia. Descarga el CSV para revisarlo o editarlo en Excel o en Hojas de cálculo de Google. En los eventos de todo el día, los valores contienen solo fechas y el día de fin queda excluido. Por ejemplo, un evento que ocupa el 12 de mayo termina el 13 de mayo.

## Crear un archivo ICS a partir de filas CSV

Elige **De CSV a ICS** y selecciona **Probar un ejemplo** para ver los encabezados. Incluye al menos las columnas `Title` y `Start`. Usa `2026-05-12` para un evento de todo el día, `2026-05-12T09:00:00` para una hora local o `2026-05-12T09:00:00Z` para la hora UTC. La herramienta también reconoce encabezados de Google Calendar como `Subject`, `Start Date`, `Start Time` y `All Day Event`. Descarga el ICS para importar los eventos a tu calendario.

## Conservar el calendario original para una copia completa

El CSV guarda los detalles de los eventos en filas. Cada serie de eventos recurrentes se representa mediante su regla, sin generar fechas individuales. Se conservan las definiciones de zona horaria incluidas en el archivo. Los archivos adjuntos, recordatorios, asistentes, excepciones de recurrencia y estados de cancelación quedan en el calendario original. La conversión se realiza en tu navegador.
