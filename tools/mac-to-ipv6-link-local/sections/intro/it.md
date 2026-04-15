## Cos'è un indirizzo IPv6 Link-Local?

Gli indirizzi IPv6 Link-Local sono indirizzi IPv6 speciali che vengono configurati automaticamente su ogni interfaccia abilitata per IPv6. Iniziano sempre con il prefisso fe80::/10 e sono utilizzati per la comunicazione tra dispositivi sullo stesso segmento di rete. Questi indirizzi non sono instradabili oltre il collegamento locale e sono comunemente utilizzati per la scoperta dei vicini, la scoperta del router e altri protocolli di rete locale. Gli indirizzi link-local possono essere generati dall'indirizzo MAC di un dispositivo utilizzando il formato EUI-64.

### Formati di input

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Output EUI-64

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Suffisso dell'interfaccia

- `%eth0`
- `%en0`
- `%wlan0`
