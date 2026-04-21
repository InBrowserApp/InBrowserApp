## Cosa normalizza questo strumento

Questo strumento converte gli indirizzi IPv4, gli indirizzi IPv6 e gli intervalli CIDR in notazione canonica direttamente nel browser. Rimuove il riempimento IPv4 non necessario, comprime IPv6 nella forma abbreviata standard e preserva la famiglia di indirizzi originale.

## Come funziona la normalizzazione CIDR

Quando inserisci un blocco CIDR, lo strumento riscrive l'indirizzo nell'indirizzo di rete effettivo per quel prefisso. I bit dell'host vengono cancellati, quindi `192.168.0.15/24` diventa `192.168.0.0/24` e `2001:db8::1234/64` diventa `2001:db8::/64`.

## Quando questo è utile

Utilizzalo prima di confrontare regole firewall, ACL, tabelle di routing, liste consentite VPN o file di configurazione importati. L'input normalizzato rende più affidabili il rilevamento, le revisioni e il copia-incolla dei duplicati negli strumenti di rete.

## Perché l'input potrebbe essere rifiutato

Lo strumento rifiuta indirizzi IPv4 o IPv6 non corretti, prefissi CIDR non validi e combinazioni di indirizzi o prefissi che non corrispondono alla famiglia di protocolli. Se il valore non può essere analizzato in modo inequivocabile, è più sicuro rifiutarlo piuttosto che normalizzare la rete sbagliata.
