## Come convertire un font TTF o OTF in WOFF2

Scegli uno o più file di font TrueType (`.ttf`) o OpenType (`.otf`), oppure trascinali nel convertitore. La conversione inizia non appena aggiungi i file. Quando un font è pronto, confronta le dimensioni del file originale e di quello WOFF2, poi seleziona **Scarica WOFF2**. Ad esempio, `Inter-Regular.ttf` diventa `Inter-Regular.woff2`. Tutta l’elaborazione avviene nel browser, quindi i file restano sul tuo dispositivo.

## Perché usare il formato WOFF2 per i font web?

Il formato WOFF2 (Web Open Font Format 2) comprime i dati del font con Brotli. In genere, usare WOFF2 sul web richiede il trasferimento di meno dati rispetto al file TTF o OTF originale. Il risparmio dipende dal font. La conversione conserva tutti i glifi e gli assi dei font variabili, quindi un singolo file può ancora coprire un intervallo di pesi. Se il tuo sito usa solo un insieme specifico di caratteri, puoi ridurre ulteriormente il file con un [generatore di sottoinsiemi di font](../font-subset-generator/).

## Come usare un file WOFF2 in CSS

Salva il file scaricato nella cartella dei font del tuo sito e richiamalo con `@font-face`. Imposta il percorso, il peso e lo stile in base al file che usi. L’esempio carica un font di peso normale da `/fonts/` e mostra il testo con un font di riserva durante il caricamento.

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

Per un font variabile, indica l’intervallo di pesi supportato dal font, ad esempio `font-weight: 100 900;`. Prima di pubblicare il font sul sito, verifica la licenza e prova le lingue e i pesi usati nelle pagine. Consulta la [documentazione MDN su @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
