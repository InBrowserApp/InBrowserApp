Genera identificatori UUID v1 localmente nel tuo browser quando ti servono valori che includono l'ora di creazione e un identificatore di nodo. Questo strumento è utile per integrazioni legacy, importazioni di database, fixture ordinate e sistemi che richiedono ancora UUID RFC 4122 versione 1.

## Quando UUID v1 è utile

UUID v1 memorizza un timestamp, una sequenza di clock e un valore di nodo a 48 bit in una stringa UUID standard di 36 caratteri. Questo rende gli ID generati ordinabili approssimativamente per ora di creazione, pur restando compatibili con sistemi che accettano normali colonne UUID, URL, log e payload API.

## Privacy e identificatori di nodo

La generazione classica di UUID v1 usava l'indirizzo MAC reale di una scheda di rete, che può esporre informazioni hardware. Questo strumento parte invece da un indirizzo MAC casuale amministrato localmente. Puoi inserire un valore di nodo specifico quando devi allinearti a un sistema legacy, ma evita di usare indirizzi hardware reali in esempi pubblici o dati condivisi.

## Sequenza di clock e generazione in batch

La sequenza di clock è un valore a 14 bit che aiuta a evitare collisioni quando lo stesso nodo genera ID nello stesso intervallo di tempo. La generazione in batch mantiene tutti gli ID nello stesso millisecondo e incrementa il tick da 100 nanosecondi per ogni riga, così ogni valore nel risultato resta distinto.
