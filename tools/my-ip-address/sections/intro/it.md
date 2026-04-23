## Cosa mostra questo strumento

Questo strumento cerca gli indirizzi IPv4 e IPv6 pubblici che i servizi esterni possono vedere dalla sessione corrente del browser. Se il browser può anche esporre candidati dell'interfaccia locale tramite WebRTC, lo strumento li elenca separatamente.

## Perché i risultati IPv4, IPv6 e WebRTC possono essere diversi

L'indirizzo IPv4 e l'indirizzo IPv6 possono provenire da percorsi di rete, ISP o configurazioni di tunneling diversi. I candidati WebRTC possono includere indirizzi LAN privati, indirizzi di interfaccia IPv6 temporanei o percorsi correlati a VPN che i normali siti Web non sempre visualizzano direttamente.

## Come funziona la ricerca

Lo strumento interroga i provider IP pubblici come Cloudflare, geojs.io, ip.sb e ipify.org, quindi arricchisce l'indirizzo rilevato con nome host, ASN, organizzazione, paese, fuso orario e metadati di coordinate quando disponibili. Ciò significa che lo strumento necessita di una connessione Internet attiva e dipende dalla qualità della risposta di tali servizi di terze parti.

## Perché un indirizzo potrebbe mancare

Un indirizzo può non essere visualizzato se la tua rete blocca una famiglia di protocolli, la tua VPN o il proxy filtra la richiesta, il tuo browser disabilita l'esposizione WebRTC o il servizio di ricerca upstream è temporaneamente non disponibile. Se IPv6 non è disponibile sulla tua rete, vedere solo IPv4 è normale.
