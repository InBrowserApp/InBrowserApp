## Cos'è un indirizzo IPv6 Link-Local?

Gli indirizzi IPv6 Link-Local sono indirizzi IPv6 speciali che vengono configurati automaticamente su ogni interfaccia abilitata per IPv6. Iniziano sempre con il prefisso fe80::/10 e sono utilizzati per la comunicazione tra dispositivi sullo stesso segmento di rete. Questi indirizzi non sono instradabili oltre il collegamento locale e sono comunemente utilizzati per la scoperta dei vicini, la scoperta del router e altri protocolli di rete locale. Gli indirizzi link-local possono essere generati dall'indirizzo MAC di un dispositivo utilizzando il formato EUI-64.

### Quando usarlo

Usalo quando ti serve l'indirizzo link-local deterministico che EUI-64 ricava dall'indirizzo MAC di un dispositivo.

### Come funziona la mappatura EUI-64

1. Normalizza l'indirizzo MAC a 48 bit.
2. Inverti il `U/L bit` nel primo byte.
3. Inserisci `ff:fe` al centro per creare un identificatore di interfaccia a 64 bit.
4. Aggiungi il prefisso `fe80::/10`.

### Formati di input supportati

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Suffisso di interfaccia opzionale

Aggiungi `%eth0`, `%en0` o un altro indice di zona solo quando un comando locale deve sapere quale interfaccia usare.
