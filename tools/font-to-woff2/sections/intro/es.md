## Cómo convertir TTF u OTF a WOFF2

Elige uno o varios archivos de fuentes TrueType (`.ttf`) u OpenType (`.otf`), o arrástralos al convertidor. La conversión comienza en cuanto añades los archivos. Cuando una fuente esté lista, compara los tamaños del archivo original y del WOFF2 y selecciona **Descargar WOFF2**. Por ejemplo, `Inter-Regular.ttf` se convierte en `Inter-Regular.woff2`. Todo el procesamiento se realiza en tu navegador, por lo que los archivos permanecen en tu dispositivo.

## ¿Por qué usar WOFF2 para fuentes web?

WOFF2 (Web Open Font Format 2) empaqueta los datos de las fuentes mediante compresión Brotli. En comparación con servir el TTF u OTF original, WOFF2 suele transferir menos bytes. El ahorro depende de la fuente. La conversión de formato conserva el conjunto completo de glifos y los ejes de las fuentes variables, de modo que un solo archivo de fuente variable puede seguir cubriendo un rango de pesos. Si tu sitio solo utiliza un conjunto concreto de caracteres, usa un [generador de subconjuntos de fuentes](../font-subset-generator/) para reducir aún más el archivo.

## Cómo usar un archivo WOFF2 en CSS

Coloca el archivo descargado en la carpeta de fuentes de tu sitio y haz referencia a él con `@font-face`. Ajusta la ruta, el peso y el estilo al archivo que vas a servir. Este ejemplo carga una fuente regular desde `/fonts/` y muestra el texto con una fuente alternativa mientras se carga.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

Para una fuente variable, usa el rango de pesos que admita realmente, como `font-weight: 100 900;`. Comprueba la licencia de la fuente antes de alojarla en un sitio web y prueba los idiomas y pesos que usan tus páginas. Consulta la [referencia de @font-face de MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
