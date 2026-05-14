## Qué hace esta herramienta

Extractor de paletas de imágenes encuentra los colores dominantes de una imagen
directamente en tu navegador. Analiza la imagen, agrupa píxeles visualmente
similares y devuelve una paleta práctica con valores HEX, RGB, HSL y de
porcentaje para cada color.

## Buenos casos de uso

- Extraer colores de marca o producto de una captura, logotipo, foto o maqueta.
- Crear una paleta CSS rápida para una landing page, miniatura o entrega
  de diseño.
- Comparar cuánto de una imagen está definido por un color dominante frente a
  acentos secundarios.
- Trabajar con imágenes privadas sin enviar el archivo a un servidor.

## Opciones de exportación

El resultado se puede copiar como una lista HEX simple, propiedades
personalizadas CSS o JSON. El formato CSS es útil cuando quieres variables como
`--palette-1`, mientras que JSON conserva juntos los formatos de color y la
proporción de dominancia para scripts o automatización de diseño.

## Aspectos a tener en cuenta

- La extracción de paleta es aproximada. Está pensada para producir grupos
  visuales útiles, no un inventario completo de cada color de píxel.
- Los píxeles transparentes se ignoran de forma predeterminada para que los
  iconos y recortes no distorsionen la paleta; desactívalo cuando la
  transparencia forme parte de la obra.
- El ajuste de calidad precisa analiza más píxeles y puede ser más lento en
  imágenes muy grandes.
