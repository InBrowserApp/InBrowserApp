WebP animado puede conservar el movimiento de un GIF y, a menudo, producir archivos más pequeños para sitios web, vistas previas de productos, documentación y recursos adecuados para chat. Este convertidor se ejecuta localmente y, cuando mantienes los ajustes predeterminados de escala, velocidad y bucle, envía el GIF original por un codificador `gif2webp` sin pérdida y de tamaño mínimo antes de exportar archivos `.webp`.

## Cuándo usarlo

Usa esta herramienta cuando tengas GIF animados que necesiten un formato web más moderno, especialmente para páginas donde importan el tamaño de archivo y la velocidad de carga. WebP animado es compatible con los navegadores principales actuales y puede conservar la transparencia, los tiempos y el comportamiento de bucle.

## Opciones de conversión

La escala cambia cada fotograma antes de codificarlo, lo que resulta útil cuando un GIF es más grande que el lugar donde se mostrará. La velocidad cambia los tiempos de reproducción sin descartar fotogramas. El comportamiento de bucle puede seguir el GIF de origen, forzar la reproducción infinita o usar un recuento personalizado para recursos que deben detenerse después de una cantidad específica de reproducciones. Mantener la escala en 100%, la velocidad en 1x y el comportamiento de bucle en Seguir GIF usa la ruta predeterminada sin pérdida y de tamaño mínimo.

## Privacidad y limitaciones

La conversión se ejecuta en tu navegador. WebP sin pérdida suele comprimir mejor las animaciones de estilo GIF, pero no puede garantizar que cada salida sea más pequeña; los GIF diminutos o ya optimizados pueden crecer porque el contenedor WebP sigue teniendo sobrecarga. Cambiar la escala, la velocidad o el comportamiento de bucle requiere decodificar fotogramas y puede usar mucha memoria con GIF muy grandes. Si el GIF de origen no contiene metadatos de bucle, la exportación predeterminada se reproduce una vez, a menos que elijas bucle infinito o personalizado.
