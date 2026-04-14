## Che cos'è NanoID?

NanoID è un generatore compatto di ID univoci e sicuri per gli URL, pensato per web app moderne, API e strumenti interni. Il formato predefinito usa 21 caratteri presi da un alfabeto di 64 caratteri, offrendo circa 126 bit di casualità pur restando abbastanza corto per URL, nomi di file e dati di test.

Tutto in questo strumento viene eseguito localmente nel browser. Il tuo alfabeto personalizzato e gli ID generati non lasciano mai la pagina, quindi è pratico per prototipi rapidi, generazione di fixture e attività operative occasionali.

**Punti chiave:**

- **Sicuro per gli URL**: usa A-Z, a-z, 0-9, - e \_.
- **Personalizzabile**: regola lunghezza e alfabeto in base ai tuoi vincoli.
- **Casualità sicura**: usa valori casuali crittografici nel browser.
- **Esportazione in testo semplice**: copia o scarica il lotto corrente quando ti servono dati seed, contenuti demo o elenchi pronti da importare.

**Indicazioni pratiche:**

- Mantieni la lunghezza predefinita di 21 caratteri quando ti serve un identificatore generico solido con una probabilità di collisione molto bassa.
- Gli ID più corti vanno bene per token UI temporanei o dati mock locali, ma il rischio di collisione aumenta quando riduci la lunghezza o generi lotti più grandi.
- Un alfabeto più ampio offre più entropia per carattere, quindi spesso puoi mantenere gli ID più corti senza perdere troppa unicità.
- Gli alfabeti personalizzati dovrebbero contenere solo caratteri unici. I duplicati alterano la distribuzione, quindi questo strumento li blocca prima di generare il risultato.
