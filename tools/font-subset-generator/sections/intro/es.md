## ¿Qué es un subconjunto de fuente?

Un subconjunto de fuente contiene los caracteres necesarios para un texto concreto, además de los glifos auxiliares que permiten representarlos. Eliminar los glifos sin usar puede reducir considerablemente la descarga de fuentes, sobre todo en fuentes grandes de chino, japonés y coreano, o en un título, logotipo o página de campaña con contenido fijo.

## Cómo usar esta herramienta

Elige un archivo TTF, OTF, WOFF o WOFF2 y pega todo el texto que utilizará esa fuente. Elige WOFF2 para usarla en la web o TTF / OTF para obtener una fuente sin comprimir y genera el subconjunto. Compara los tamaños, revisa la vista previa y descarga la fuente y su CSS correspondiente. El procesamiento de fuentes se ejecuta localmente en un Web Worker.

## ¿Qué se conserva?

HarfBuzz conserva las dependencias entre glifos y las funciones de composición de OpenType necesarias para las ligaduras, el ajuste entre pares, las marcas combinantes y las escrituras complejas. También se conservan las instrucciones de ajuste y los ejes de fuentes variables. Se incluyen las formas compuestas y descompuestas canónicamente equivalentes del texto cuando la fuente original las admite. La vista previa usa la fuente generada y los caracteres ausentes en la fuente original se muestran por separado.

## Consejos prácticos

- Incluye los espacios, los signos de puntuación, los números y todas las cadenas traducidas que necesites. Añade el conjunto latino predefinido si tu texto también incluirá caracteres latinos básicos.
- Vuelve a generar el subconjunto cuando cambie el texto. Un subconjunto fijo es más adecuado para contenido conocido; usa una cobertura de caracteres más amplia para contenido generado por los usuarios.
- Crear un subconjunto no permite añadir caracteres que faltan en la fuente original. Mantén una fuente alternativa en CSS para los caracteres que queden fuera del subconjunto.
- Usa una fuente cuya licencia permita modificarla e incrustarla en la web. Las colecciones de fuentes (`.ttc` / `.otc`) deben exportarse primero como fuentes individuales.
- Es posible que las fuentes pequeñas o ya reducidas a un subconjunto no disminuyan de tamaño. WOFF2 suele ofrecer la descarga más pequeña para la web; el recuento de glifos también incluye los auxiliares.
