## Por qué esta herramienta es útil

La mayoría de los sitios no necesita un sistema enorme de sitemaps. Los motores de búsqueda necesitan un XML válido con URL estables, señales de actualización razonables y sin errores de formato accidentales. Esta herramienta se centra en ese trabajo esencial.

## Qué cubre

- Crear un sitemap `urlset` estándar para páginas de un sitio.
- Crear un documento `sitemapindex` cuando ya separas un sitio grande en varios archivos sitemap.
- Trabajar con URL absolutas o con rutas relativas limpias unidas a una URL base.

## Qué conviene vigilar

- Las ubicaciones del sitemap deberían resolver a las URL canónicas finales, no a redirecciones temporales.
- `lastmod`, `changefreq` y `priority` son indicaciones, no garantías sobre el rastreo.
- Si cada fila ya es una URL completa, desactiva la unión automática con la URL base para mantener el XML explícito.
