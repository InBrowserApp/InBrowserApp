## ¿Qué es un conversor de cURL?

Un conversor de cURL transforma un comando cURL en código listo para usar para muchos lenguajes y clientes HTTP. Resulta útil cuando la documentación de una API, las herramientas de desarrollo del navegador o el historial de la terminal ya te dan una solicitud funcional y quieres llevarla a tu código sin reconstruir a mano el método, la URL, los encabezados, las cookies o el cuerpo.

**Crédito**
Con tecnología de [curlconverter](https://curlconverter.com) por Nick Carneiro.

## Cuándo resulta útil esta herramienta

- Cuando partes de un ejemplo de cURL que ya funciona en la documentación de una API o en el historial de la terminal.
- Cuando quieres comparar la misma solicitud entre `fetch`, Python `requests`, Go, Java, PHP y otros destinos antes de elegir uno.
- Cuando quieres generar una base rápida y después añadir el manejo de errores, los reintentos, la renovación de autenticación y la configuración propia de tu proyecto.

## Qué revisar después de la conversión

- Asegúrate de que el destino seleccionado coincida con la librería HTTP y el runtime que realmente usa tu proyecto.
- Lee las advertencias con atención. Algunas reglas de comillas del shell, variables de entorno u opciones de cURL no compatibles pueden requerir ajustes manuales.
- Sustituye los tokens de ejemplo, secretos o URLs de muestra antes de enviar el código generado.
