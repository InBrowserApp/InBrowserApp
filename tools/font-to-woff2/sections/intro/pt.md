## Como converter TTF ou OTF para WOFF2

Selecione um ou mais arquivos de fonte TrueType (`.ttf`) ou OpenType (`.otf`), ou arraste-os para o conversor. A conversão começa assim que você adiciona os arquivos. Quando uma fonte estiver pronta, compare os tamanhos do arquivo original e do WOFF2 e selecione **Baixar WOFF2**. Por exemplo, `Inter-Regular.ttf` se torna `Inter-Regular.woff2`. Todo o processamento é feito no navegador, então os arquivos permanecem no seu dispositivo.

## Por que usar WOFF2 para fontes web?

O WOFF2 (Web Open Font Format 2) empacota os dados da fonte com compressão Brotli. Em comparação com o envio do TTF ou OTF original, o WOFF2 geralmente transfere menos bytes. A economia depende da fonte. A conversão de formato mantém o conjunto completo de glifos e preserva os eixos das fontes variáveis, de modo que um único arquivo de fonte variável ainda pode abranger uma variedade de pesos. Se o seu site usa apenas um conjunto específico de caracteres, use um [gerador de subconjuntos de fontes](../font-subset-generator/) para reduzir ainda mais o arquivo.

## Como usar um arquivo WOFF2 no CSS

Coloque o arquivo baixado na pasta de fontes do seu site e faça referência a ele com `@font-face`. Ajuste o caminho, o peso e o estilo ao arquivo que será usado. Este exemplo carrega uma fonte regular de `/fonts/` e exibe o texto com uma fonte alternativa durante o carregamento.

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

Para uma fonte variável, use o intervalo de pesos que ela realmente oferece, como `font-weight: 100 900;`. Verifique a licença da fonte antes de hospedá-la em um site e teste os idiomas e pesos usados nas suas páginas. Consulte a [referência de @font-face da MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
