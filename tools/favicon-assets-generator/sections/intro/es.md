## Qué genera la herramienta

Este generador convierte una sola imagen en un paquete de favicons moderno y
completo: un `.ico` multitamaño para navegadores antiguos, las variantes PNG
de 16 / 32 / 180 / 192 / 512, un `.svg` original opcional, un
`site.webmanifest` para PWA y el fragmento HTML que pegas en `<head>`. Cada
byte se produce en tu navegador; sin subidas, sin servidor, sin analítica.

## Qué incluye el paquete

- `favicon.ico` — multiimagen (16 / 32 / 48) para pestañas del navegador,
  marcadores y accesos directos antiguos de Windows.
- `favicon-16x16.png` y `favicon-32x32.png` — variantes PNG modernas que
  usan los navegadores actuales.
- `favicon.svg` — se incluye únicamente cuando tu imagen de origen es SVG y
  el interruptor "Usar SVG original" está activado.
- `apple-touch-icon.png` — 180×180, opaco, usado por las pantallas de
  inicio de iOS.
- `pwa-192x192.png` y `pwa-512x512.png` — los iconos PWA estándar.
- `pwa-maskable-192x192.png` y `pwa-maskable-512x512.png` — variantes
  enmascarables con el área segura recomendada por la W3C.
- `site.webmanifest` — el manifiesto PWA conectado a los iconos anteriores.

## Cómo funcionan el relleno, el fondo y las zonas seguras enmascarables

Cada plataforma tiene su propio relleno ("Margen") para que puedas dejar
espacio dentro del lienzo del icono. El interruptor "Añadir fondo" pinta un
cuadrado opaco detrás de tu origen, útil cuando el origen es transparente y
el destino requiere opacidad (la pantalla de inicio de Apple) o simplemente
para contraste visual en una pestaña del navegador. Los iconos PWA
enmascarables usan una zona segura adicional sobre el margen de la
plataforma: cualquier cosa fuera del ~80% central puede ser recortada por
Android, Windows o ChromeOS cuando apliquen una máscara circular,
redondeada o tipo squircle.

## Cómo integrar el paquete en tu sitio

1. Descomprime el archivo descargado en la raíz de tu sitio (de modo que
   los archivos queden en `/favicon.ico`, `/site.webmanifest`, etc.).
2. Pega el fragmento HTML en el `<head>` de tu sitio.
3. Si sirves los recursos desde una subruta (por ejemplo `/static/icons/`),
   configura "Ruta de los recursos" antes de generar para que el fragmento y
   el manifiesto usen las URL correctas.
4. Si personalizaste el manifiesto más allá de lo que esta herramienta
   expone (por ejemplo, para añadir `categories` o `screenshots`), abre
   `site.webmanifest` en un editor de texto y modifícalo directamente: es
   JSON plano.
