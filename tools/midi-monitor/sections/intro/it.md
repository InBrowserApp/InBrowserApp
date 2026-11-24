## Come collegare una tastiera o un controller MIDI

Collega un dispositivo MIDI e verifica che il sistema operativo lo riconosca. Seleziona **Abilita MIDI**, concedi al browser l'autorizzazione MIDI se richiesta e scegli un ingresso. Usa un browser compatibile tramite HTTPS. Il monitor ascolta l'ingresso selezionato e visualizza i messaggi localmente.

## Come provare le note e la velocity

Premi un tasto o un pad e osserva la tastiera e il registro dei messaggi. Note On mostra la nota e la sua velocity, di solito un valore da 1 a 127. Note Off o un Note On con velocity 0 rilascia la nota. La tastiera indica la nota MIDI 60 come C4. Cambia l'ottava iniziale per visualizzare un'altra gamma di note. Le note tenute sono elencate anche quando si trovano fuori dalla gamma visualizzata.

## Come analizzare CC, pitch bend e MIDI Clock

Muovi una manopola, un fader o un pedale per vedere il numero e il valore del relativo Control Change (CC). Ad esempio, molti pedali sustain inviano CC 64. Il Pitch Bend è mostrato attorno a un valore centrale di 0. Gli impulsi MIDI Clock vengono conteggiati separatamente dal registro dei messaggi. Un MIDI Clock standard invia 24 impulsi per ogni nota da un quarto. Il registro include i numeri di canale e i byte esadecimali grezzi per analizzare i singoli messaggi.

## Perché il mio ingresso MIDI non risponde?

Controlla il cavo, l'alimentazione e la modalità del dispositivo e verifica che la porta selezionata corrisponda al controller. Chiudi le altre app che potrebbero usare l'ingresso, poi ricollegalo. Il supporto dipende dal browser e dal sistema operativo. Questo strumento ascolta i messaggi MIDI standard con il normale accesso MIDI. I messaggi System Exclusive (SysEx) specifici del dispositivo richiedono un'autorizzazione aggiuntiva.
