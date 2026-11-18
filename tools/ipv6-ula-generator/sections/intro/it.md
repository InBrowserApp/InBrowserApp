## Generare un prefisso IPv6 ULA /48

Copia il prefisso `fd` generato per la tua rete domestica, il tuo laboratorio o la tua VPN. Salva il `/48` scelto con la configurazione di rete, così potrai riutilizzarlo quando aggiungi subnet. Seleziona **Genera nuovo prefisso** quando vuoi una nuova assegnazione.

## Calcolare una subnet /64

Inserisci un **ID subnet** esadecimale da `0000` a `ffff`. Per esempio, l’ID `00a0` nel prefisso `fd12:3456:789a::/48` dà `fd12:3456:789a:a0::/64`. Un `/48` offre 65.536 subnet `/64`, così puoi assegnare prefissi distinti alla LAN, al Wi-Fi per gli ospiti o alla VPN.

## Da dove viene il prefisso fd

La RFC 4193 definisce gli indirizzi locali univoci nello spazio `fc00::/7`. La metà assegnata localmente, `fd00::/8`, inizia con `fd`. Il generatore usa la Web Crypto API del browser per aggiungere un ID globale casuale di 40 bit e formare il prefisso `/48`.

## Quando usare un indirizzo locale univoco

Usa un ULA per mantenere stabili gli indirizzi IPv6 all’interno di una rete o tra sedi collegate tramite VPN. Un dispositivo può usare anche un indirizzo IPv6 globale per il traffico su Internet e mantenere l’ULA per i servizi interni.
