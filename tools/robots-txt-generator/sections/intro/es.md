## ¿Qué es un generador de robots.txt?

Un generador de robots.txt ayuda a combinar reglas de user-agent, rutas allow/disallow y enlaces de sitemap para crear el archivo robots.txt. Publícalo en la raíz del sitio como /robots.txt para que los rastreadores lo lean.

### Lo que este generador te ayuda a hacer

- Crear reglas separadas para motores de búsqueda, rastreadores de IA o bots personalizados
- Añadir `Allow`, `Disallow`, el sitemap y directivas avanzadas opcionales en un solo lugar
- Copiar o descargar un archivo `robots.txt` listo para publicar

### Ejemplo

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

Este ejemplo pide a los rastreadores que eviten la mayor parte de `/admin/`, mantiene `/admin/help/` accesible para rastreo y les indica dónde está el sitemap.

### Notas importantes

- Publica el archivo en `/robots.txt` en la raíz de tu sitio
- `robots.txt` es público y orientativo; no es control de acceso
- No todos los rastreadores admiten `Host` y `Crawl-delay`
