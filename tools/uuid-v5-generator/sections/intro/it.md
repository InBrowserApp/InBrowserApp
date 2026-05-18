Genera identificatori UUID v5 da un UUID di namespace e da un nome senza inviare nessuno dei due valori a un server. UUID v5 è utile quando ti serve un identificatore stabile che possa essere ricreato in seguito dallo stesso input, ad esempio un ID per un nome di dominio, URL, percorso di oggetto, handle account o record fixture.

## Come funziona UUID v5

UUID v5 combina un UUID di namespace con una stringa nome, calcola l'hash di quei byte con SHA-1 e poi applica i bit di versione e variante di RFC 4122. Poiché l'input è deterministico, `example.com` nel namespace DNS produce sempre lo stesso UUID: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Scegliere un namespace

Usa `ns:DNS` per i nomi di dominio, `ns:URL` per gli URL, `ns:OID` per gli identificatori di oggetti e `ns:X.500 DN` per i nomi distinti X.500. Puoi anche incollare il tuo namespace UUID quando la tua applicazione richiede identificatori limitati a un prodotto, tenant, dataset o migrazione.

## Quando usarlo

Scegli UUID v5 quando la riproducibilità conta più della casualità. È adatto per import deterministici, fixture di test, record con namespace e sistemi che devono assegnare allo stesso elemento logico lo stesso ID tra esecuzioni diverse. Per token segreti o ID pubblici imprevedibili, usa invece un generatore casuale.
