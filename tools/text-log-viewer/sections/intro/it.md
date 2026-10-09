## Leggi testo e log in locale

Apri un file .txt, .text o .log per leggerlo con numeri di riga, dimensione del testo regolabile, a capo automatico facoltativo e lettura senza distrazioni. Passa a una riga, vai all’inizio o alla fine oppure usa Trova testo per cercare nell’intero file. La ricerca è letterale e distingue maiuscole e minuscole; passando alla corrispondenza successiva o precedente, la ricerca riprende dall’altro estremo del file.

## File grandi e righe lunghe

Il lettore mostra una sezione alla volta per mantenere utilizzabili i file di grandi dimensioni. Ogni sezione resta accessibile, compresa la continuazione delle righe molto lunghe. La selezione e il comando Trova del browser riguardano la sezione corrente; Trova testo del lettore cerca nell’intero file decodificato, incluse le corrispondenze a cavallo tra sezioni. Non viene imposto alcun limite alla dimensione del file o al numero di righe. La memoria disponibile nel browser costituisce comunque un limite pratico.

Righe vuote, tabulazioni, fine riga misti CRLF/CR/LF e testo Unicode vengono preservati. I fine riga sono visualizzati come interruzioni di riga. Il markup e le sequenze di escape del terminale restano testo inerte. Alcuni caratteri di controllo non hanno un glifo visibile; per i file contenenti caratteri NUL viene mostrato un avviso di file binario.

## Scegli la codifica giusta

La modalità automatica riconosce i marcatori dell’ordine dei byte UTF-8 e UTF-16 e, in loro assenza, usa UTF-8 con validazione rigorosa. Puoi scegliere UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 o Shift JIS. Un errore di decodifica interrompe l’anteprima invece di sostituire silenziosamente i caratteri illeggibili. Prova un’altra codifica se il file è illeggibile o il testo appare alterato; il visualizzatore non può determinare la codifica originale di ogni file.

I file vengono elaborati sul tuo dispositivo senza caricamenti, risorse remote o salvataggio automatico. La chiusura o la sostituzione di un file libera le risorse della sessione di lettura. Questo visualizzatore non modifica i file, non interpreta HTML o comandi del terminale e non segue i log in tempo reale.
