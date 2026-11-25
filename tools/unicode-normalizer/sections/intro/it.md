## Come normalizzare il testo Unicode

Incolla o digita il testo nel campo **Testo originale**, poi scegli una forma di normalizzazione. Il risultato si aggiorna mentre scrivi o quando cambi forma. Seleziona **Copia risultato** per usare il testo normalizzato in un’altra app. La conversione avviene nel browser e il testo rimane sul tuo dispositivo.

## Quale forma di normalizzazione Unicode scegliere?

- **NFC (composizione canonica)** è una buona scelta per il testo di uso comune. Se esiste un carattere composto, unisce una lettera e il suo accento in un unico punto di codice. Usala per uniformare le rappresentazioni equivalenti prima di archiviare o confrontare il testo.
- **NFD (decomposizione canonica)** scompone le sequenze nei loro elementi canonici, come una lettera di base e un accento combinante. È utile per esaminare o elaborare separatamente i segni diacritici.
- **NFKC (composizione di compatibilità)** uniforma anche le varianti di compatibilità, come le lettere a larghezza piena e le legature. È utile per ricerche e confronti in cui queste differenze non contano.
- **NFKD (decomposizione di compatibilità)** applica le stesse corrispondenze di compatibilità e lascia il risultato in forma decomposta, utile per analizzare il testo.

## Perché il testo normalizzato può sembrare identico?

La lettera **é** può essere rappresentata da `U+00E9` oppure da una **e** seguita da un accento acuto combinante (`U+0065 U+0301`). NFC produce la prima rappresentazione, NFD la seconda. Apri **Confronta i punti di codice** per vedere la sequenza all’inizio di ciascun testo, anche quando entrambi appaiono identici.

Seleziona **Prova un esempio** per vedere anche i cambiamenti visibili. Con NFKC, **ＡＢＣ ① ﬁ** diventa **ABC 1 fi**. NFC conserva queste distinzioni di compatibilità.

## Quando può cambiare il significato del testo con la normalizzazione?

NFKC e NFKD possono eliminare distinzioni tipografiche, come un apice in una formula o un numero cerchiato in un elenco. Scegli NFC se queste distinzioni sono importanti. Cambiare tra maiuscole e minuscole, rimuovere gli accenti o passare da una codifica all’altra, ad esempio da UTF-8 a UTF-16, sono operazioni distinte.

Per approfondire, consulta [l’allegato allo standard Unicode sulle forme di normalizzazione](https://www.unicode.org/reports/tr15/).
