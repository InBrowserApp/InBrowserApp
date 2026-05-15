# Grabador de pantalla

Graba una pantalla, ventana o pestaña seleccionada por el navegador sin subir el
video a un servidor. La herramienta usa las API Screen Capture y MediaRecorder
del navegador, por lo que la grabación permanece local hasta que la descargues.

## Cuándo usarlo

Usa el grabador para demostraciones breves, informes de errores, recorridos,
notas de QA o videos internos rápidos cuando baste con un flujo ligero en el
navegador. Puedes pedir al navegador que incluya audio de la pestaña o del
sistema y, de forma opcional, mezclar tu micrófono antes de que empiece la
grabación.

## Privacidad y compatibilidad del navegador

El navegador decide qué fuentes de captura y opciones de audio están
disponibles. Algunos navegadores solo comparten audio de la pestaña actual,
otros requieren HTTPS y otros no admiten pausar o grabar en absoluto. Si se
deniega el permiso, no se conserva ningún flujo y puedes reintentar con otros
ajustes.

## Consejos para grabaciones fiables

Cierra las sesiones de captura no relacionadas antes de empezar, elige la fuente
más pequeña que te sirva y haz una prueba breve cuando el audio sea importante.
Descarga el resultado antes de borrarlo, porque las grabaciones solo se
mantienen en la sesión actual de la página.
