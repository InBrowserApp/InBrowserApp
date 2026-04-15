## Come convertire IPv6 in indirizzo MAC

Puoi ricavare di nuovo un indirizzo MAC da un indirizzo IPv6 solo quando
l'identificatore di interfaccia IPv6 è stato derivato da quel MAC con il
metodo EUI-64. Questo accade più spesso con indirizzi link-local meno recenti
che iniziano con `fe80::` e con alcuni indirizzi autoconfigurati senza stato.

### Quando funziona

Questa conversione inversa funziona quando gli ultimi 64 bit dell'indirizzo
IPv6 contengono ancora un identificatore di interfaccia EUI-64.

- L'identificatore di interfaccia è stato costruito a partire da un MAC a
  48 bit.
- I byte centrali sono ancora `ff:fe`.
- L'indirizzo non è stato generato da estensioni per la privacy o da un altro
  schema di randomizzazione.

### Come funziona la conversione

Il convertitore ricostruisce il MAC con questi passaggi:

1. Legge gli ultimi 64 bit dell'indirizzo IPv6.
2. Rimuove i byte `ff:fe` inseriti al centro dell'identificatore di
   interfaccia.
3. Inverte il bit universal/local del primo byte.
4. Formatta i restanti 48 bit come un indirizzo MAC standard.

### Perché non appare un MAC

Potresti non ottenere un risultato per diversi motivi:

- L'indirizzo IPv6 non è sintatticamente valido.
- L'indirizzo è valido, ma non è stato generato da un MAC tramite EUI-64.
- L'indirizzo usa privacy, randomizzazione stabile, DHCPv6 o un altro metodo
  di assegnazione non basato su MAC.
