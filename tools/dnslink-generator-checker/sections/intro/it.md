## Genera un record TXT DNSLink per IPFS

DNSLink collega un dominio o sottodominio a un percorso di contenuto. Inserisci il dominio e incolla un CID IPFS oppure un percorso IPFS o IPNS. Copia il **Nome** e il **Valore TXT** generati in un nuovo record TXT presso il tuo provider DNS. Ad esempio, per il dominio `www.example.com` il nome del record è `_dnslink.www.example.com`. Se l’editor DNS aggiunge automaticamente `example.com`, inserisci `_dnslink.www` nel campo del nome.

## Controlla la destinazione del tuo DNSLink

Seleziona **Controlla il record pubblicato** per vedere le risposte TXT di Cloudflare e Google. Lascia vuota la destinazione per cercare una configurazione esistente oppure inserisci la destinazione prevista per confrontarla con il valore pubblicato. Dopo una modifica, i resolver possono restituire un valore precedente fino alla scadenza delle loro cache. Il TTL mostrato indica per quanto tempo una risposta DNS ricevuta può rimanere nella cache.

## Aggiorna un sito IPFS con un dominio personalizzato

Usa un CID IPFS per puntare direttamente a una versione fissa dei tuoi file oppure un percorso IPNS per seguire un nome aggiornabile. DNSLink indica ai client e ai gateway compatibili quale contenuto risolvere. Per servire quel contenuto sul tuo dominio HTTPS, configura un gateway che supporti DNSLink e indirizza il dominio verso di esso. [Domini personalizzati e DNSLink nella documentazione IPFS](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
