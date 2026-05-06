## Cosa fa questo strumento

Questo strumento combina blocchi CIDR nel set equivalente più piccolo, quindi sottrae tutti i blocchi CIDR inseriti nell'elenco di esclusione. Supporta IPv4 e IPv6 nella stessa esecuzione, e tutta l'elaborazione avviene localmente nel browser.

## Come funzionano unione ed esclusione

L'elenco di unione viene prima normalizzato: i bit host vengono azzerati, le reti sovrapposte vengono accorpate e le reti adiacenti vengono compresse quando possono essere rappresentate da un blocco CIDR più breve. Dopo questo passaggio, l'elenco di esclusione viene sottratto dagli intervalli uniti. L'output finale viene riespanso nell'elenco CIDR minimo che copre esattamente ciò che rimane.

## Quando è utile

Usalo quando pulisci regole firewall, prepari voci per gruppi di sicurezza cloud, rivedi allowlist VPN, riassumi tabelle di routing o rimuovi intervalli riservati da un'allocazione più ampia. È particolarmente utile quando la configurazione copiata contiene blocchi sovrapposti o quando da una rete ampia devono essere rimossi alcuni intervalli più piccoli.

## Note sull'input

Inserisci un CIDR per riga, oppure separa più CIDR con virgole. I blocchi IPv4 e IPv6 possono essere incollati insieme, ma le esclusioni si applicano solo ai blocchi della stessa famiglia di indirizzi. Le voci non valide vengono segnalate con il relativo elenco e numero di riga, così puoi correggere input incollati di grandi dimensioni senza procedere per tentativi.
