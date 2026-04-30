CIDR Parser trasforma un blocco come `10.24.8.19/21` o `2001:db8:abcd::123/64` nella rete che intendi davvero. Normalizza l’input con indirizzo host, mostra la subnet canonica ed espone i confini che servono di solito per scrivere regole firewall, documentare intervalli o verificare se un’allocazione è più grande del previsto.

## Cosa mostra

Il risultato parte da una panoramica rapida e poi divide il blocco in dettagli pratici: CIDR canonico, conteggi degli indirizzi totali e utilizzabili, inizio e fine intervallo, più i valori interi dietro il blocco. Per IPv4 ottieni anche netmask, wildcard mask e indirizzo broadcast. Per IPv6 il parser mantiene lo stesso flusso ma nasconde i campi non applicabili.

## Perché la canonicalizzazione conta

Molti valori CIDR incollati includono bit host. Va bene per le persone, ma router, ACLs e documentazione di solito richiedono l’indirizzo di rete canonico. Riscrivendo il blocco prima della copia, lo strumento rende più facile intercettare ipotesi off-by-one prima che finiscano nella configurazione.

## Note pratiche

- I blocchi IPv4 `/31` e `/32` sono trattati come completamente utilizzabili, in linea con gli usi moderni point-to-point e host-route.
- I blocchi IPv6 riportano l’intero spazio indirizzi e l’intervallo utilizzabile senza inventare un concetto di broadcast.
- Tutto gira localmente nel browser, quindi le subnet interne non lasciano la pagina durante l’ispezione.
