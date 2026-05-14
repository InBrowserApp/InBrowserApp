Reverse IP Lookup converte un indirizzo IPv4 o IPv6 nel relativo nome DNS inverso e interroga il record `PTR` corrispondente. Aiuta a verificare quale hostname pubblica il proprietario di un indirizzo per server di posta, appliance di rete, istanze cloud e note di troubleshooting.

## Cosa controlla

Per IPv4, lo strumento inverte gli ottetti e interroga un nome `in-addr.arpa`. Per IPv6, espande l'indirizzo in 32 nibble esadecimali, li inverte e interroga il nome `ip6.arpa` corrispondente. Il risultato mostra il dominio DNS inverso esatto, il codice di stato DNS, il resolver, la famiglia di indirizzi e gli eventuali hostname restituiti con i rispettivi valori TTL.

## Come viene eseguita la query

La ricerca viene eseguita dal browser usando DNS-over-HTTPS. Puoi scegliere Cloudflare, Google o AliDNS come resolver, e il browser invia una query `PTR` standard a quell'endpoint. Non è coinvolto alcun servizio di ricerca lato server di InBrowser.App.

## Come leggere i risultati mancanti

Una risposta PTR mancante è comune. Molti indirizzi residenziali, cloud, privati o assegnati di recente non pubblicano record DNS inversi. Una risposta DNS riuscita senza hostname non dimostra che l'indirizzo sia inutilizzato; significa solo che la zona inversa non ha restituito un record `PTR` utilizzabile tramite il resolver selezionato.

## Note pratiche

- Il DNS inverso associa un indirizzo IP a un hostname; è diverso dal trovare ogni dominio ospitato sullo stesso indirizzo.
- I record PTR sono controllati dal proprietario dell'indirizzo IP o dal provider upstream, non solo dal proprietario del dominio.
- I sistemi di posta e sicurezza spesso confrontano DNS diretto e inverso, quindi un record PTR dovrebbe di solito puntare a un hostname che si risolve nello stesso indirizzo.
