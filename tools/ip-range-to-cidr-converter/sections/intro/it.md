## Cosa fa questo strumento

Questo strumento converte un indirizzo IP iniziale e un indirizzo IP finale nel set più piccolo di blocchi CIDR che copre esattamente l'intero intervallo. Tutto viene eseguito localmente nel tuo browser, quindi gli indirizzi non lasciano mai il tuo dispositivo.

## Come funziona la copertura CIDR

Un blocco CIDR rappresenta una rete di dimensioni potenze di due allineata su un confine corrispondente. Quando un intervallo inizia o finisce nel mezzo di questi confini, un blocco non è sufficiente. Il convertitore continua a prendere il blocco allineato più grande che si adatta, quindi ripete fino a coprire l'intero intervallo.

## Perché possono apparire più blocchi

Intervalli come da 192.168.1.10 a 192.168.1.25 non iniziano su un confine di rete pulito e non terminano nemmeno su uno. Il risultato esatto è quindi un breve elenco di blocchi, ciascuno dei quali copre una porzione allineata senza includere indirizzi aggiuntivi al di fuori dell'intervallo richiesto.

## Quando questo è utile

Utilizzalo durante la preparazione di regole firewall, riepiloghi di percorso, voci ACL, gruppi di sicurezza cloud o elenchi di controllo di migrazione in cui un intervallo iniziale e finale non elaborato deve diventare una notazione CIDR standard.
