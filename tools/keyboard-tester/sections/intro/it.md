## Come testare la tastiera

Seleziona **Avvia il test**, poi premi e rilascia i tasti della tastiera fisica uno alla volta. Ogni tasto si illumina mentre lo tieni premuto e resta contrassegnato da un puntino quando lo rilasci. Prova i tasti Ctrl, Shift e Alt di entrambi i lati, e verifica separatamente il tastierino numerico se la tua tastiera ne ha uno. Seleziona **Reimposta** per cancellare i segni e ripetere la prova.

## Testare combinazioni di tasti, rollover e ghosting

Prova una combinazione che usi in un gioco o in un’app. Ad esempio, tieni premuti insieme `W`, `A`, `Shift` e `Space`. In **Combinazione attuale** dovrebbero apparire tutti e quattro. **Max simultanei** indica il numero più alto di tasti rilevati contemporaneamente dal browser durante il test, modificatori inclusi.

Il rollover è la capacità della tastiera di registrare più tasti nello stesso momento. Se un tasto funziona da solo ma scompare in una determinata combinazione, la tastiera potrebbe bloccare quell’input. Se compare un tasto che non hai mai premuto, potrebbe essere una pressione fantasma (ghosting). Prova la combinazione che ti dà problemi, perché gruppi diversi di tasti possono comportarsi in modo diverso. [Dimostrazione del ghosting della tastiera di Microsoft](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## Perché un tasto non viene rilevato?

Seleziona di nuovo **Avvia il test** se hai fatto clic altrove o hai usato Tab o Esc per uscire dall’area di prova. Alcuni tasti, come Fn e certi tasti multimediali, sono gestiti direttamente dalla tastiera o dal sistema operativo. Anche il browser può intercettare una scorciatoia prima che raggiunga questa pagina. Se un tasto di una lettera non risponde mai quando lo premi da solo, provalo in un’altra app per vedere se il problema si ripete.

## Perché si illumina un tasto diverso?

Lo schema riproduce le posizioni fisiche di una tastiera ANSI in formato completo. Con il layout AZERTY francese, premere `A` può illuminare `Q` nello schema. In **Ultimo tasto** trovi il valore prodotto dal tuo layout, `a`, accanto al codice fisico `KeyQ`. Se usi una tastiera compatta, prova i tasti che ha. [Guida di MDN ai codici fisici dei tasti](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
