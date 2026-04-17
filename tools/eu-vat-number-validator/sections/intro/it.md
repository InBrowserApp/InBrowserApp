## Che cos'è una partita IVA UE?

Un numero di identificazione IVA è rilasciato da uno Stato membro dell'UE alle imprese registrate ai fini dell'Imposta sul Valore Aggiunto. Inizia con un codice paese di due lettere (ad esempio, `BE` per il Belgio o `EL` per la Grecia), seguito da una sequenza di cifre e talvolta lettere specifica per ciascun paese. Le autorità fiscali lo utilizzano per tracciare gli scambi transfrontalieri e le richieste di rimborso, quindi errori su fatture, contratti o registri di approvvigionamento possono facilmente bloccare un pagamento o innescare un controllo.

## Cosa verifica realmente questo strumento

Questo strumento esegue tre validazioni indipendenti, tutte nel tuo browser:

1. **Codice paese** — le prime due lettere devono corrispondere a uno Stato membro dell'UE che partecipa al regime IVA (incluso il codice speciale `EL` utilizzato per la Grecia).
2. **Formato** — i caratteri rimanenti devono corrispondere al formato IVA documentato del paese. Ad esempio, la partita IVA belga è composta esattamente da dieci cifre, quella austriaca inizia con `U` seguito da otto cifre e quella olandese ha la forma `<nove cifre>B<due cifre>`.
3. **Checksum** — laddove esista un checksum deterministico nelle regole IVA del paese (Austria, Belgio, Danimarca, Finlandia, Francia, Germania, Italia, Paesi Bassi, Polonia, Portogallo, Spagna, Svezia), la cifra o lettera finale viene ricalcolata e confrontata.

Un numero che supera tutti e tre i controlli è sintatticamente ben formato. Questo non equivale a confermare che l'impresa sia attualmente registrata — per questo è ancora necessario il servizio VIES della Commissione europea o l'autorità fiscale locale. Questo strumento è meglio utilizzato prima di quel controllo finale, per individuare refusi, cifre trasposte ed errori di copia-incolla che fanno fallire una query VIES per il motivo sbagliato.

## Cose comuni che rileva

- Numeri che a prima vista sembrano giusti ma mancano di un paese (ad esempio, che iniziano con `US` o `UK`).
- Zeri iniziali eliminati da un foglio di calcolo, che producono un numero con una cifra in meno.
- Spazi, punti o trattini incollati da un sistema di fatturazione — lo strumento li normalizza e verifica il risultato.
- Il classico scambio tra il codice greco `GR` e il codice IVA `EL`, che il controllo del formato rifiuta immediatamente.

## Cosa mostra la scheda del risultato

Oltre a un semplice badge valido/non valido, il risultato scompone il paese, il numero normalizzato, il formato previsto dal paese e se il checksum è stato superato, fallito o saltato perché il paese non ne pubblica uno. Quel dettaglio è utile quando devi spiegare un rifiuto — "il formato va bene, il checksum non corrisponde" è molto più utile di "non valido".

## Privacy

Ogni controllo viene eseguito localmente nel tuo browser. Nulla viene inviato a un server, registrato o memorizzato altrove se non nel localStorage del tuo browser (per l'ultimo input che hai digitato, in modo che sopravviva a un ricaricamento della pagina). Puoi incollare la partita IVA di un cliente senza preoccuparti di dove finisca.
