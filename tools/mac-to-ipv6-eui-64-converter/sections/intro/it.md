## Come convertire un indirizzo MAC in IPv6

Inserisci un indirizzo MAC a 48 bit con due punti, trattini, punti o senza separatori. Aggiungi il prefisso di rete IPv6 `/64` che vuoi usare. Il convertitore accetta la notazione abbreviata e quella estesa. I bit dell’host nel prefisso devono essere tutti a zero. L’indirizzo IPv6 si aggiorna mentre scrivi ed è subito disponibile per la copia. Il pulsante **Prova un esempio** compila entrambi i campi.

## Come si forma l’indirizzo con EUI-64 modificato

In una sottorete `/64`, il prefisso di rete fornisce i primi 64 bit e l’identificatore di interfaccia gli ultimi 64. EUI-64 modificato inserisce `ff:fe` tra le due metà dell’indirizzo MAC e inverte il bit universale/locale nel primo byte. Ad esempio, da `00:11:22:33:44:55` si ottiene l’identificatore di interfaccia `211:22ff:fe33:4455`. Con il prefisso `2001:db8:1:2::/64` si ottiene l’indirizzo `2001:db8:1:2:211:22ff:fe33:4455`.

## Prefissi IPv6 comuni

- **Link-local.** Usa `fe80::/64` per comunicare sullo stesso collegamento. Il pulsante **Usa prefisso link-local** inserisce il prefisso e conserva l’indirizzo MAC che hai digitato. Per aggiungere un nome di interfaccia come `%eth0`, usa il [convertitore per indirizzi IPv6 link-local](/it/tools/mac-address-to-ipv6-link-local-address-converter/).
- **Indirizzo locale univoco (ULA).** Il pulsante **Usa esempio ULA** inserisce `fd12:3456:789a:1::/64`, un esempio dell’intervallo `fd00::/8` destinato alle reti interne. Per creare un prefisso univoco per la tua rete, usa il [generatore di ULA IPv6](/it/tools/ipv6-ula-generator/).
- **Unicast globale.** Inserisci una sottorete `/64` del blocco che ti ha assegnato il tuo fornitore di servizi Internet, il tuo provider cloud o il tuo amministratore di rete.
- **Documentazione.** Il prefisso `2001:db8:1:2::/64` fa parte dell’intervallo `2001:db8::/32`, riservato alla documentazione e agli esempi.

## Il risultato corrisponderà all’indirizzo IPv6 del mio dispositivo?

Il risultato è l’indirizzo calcolato per il tuo prefisso secondo EUI-64 modificato. Un dispositivo può usare un altro identificatore di interfaccia, come un identificatore stabile o temporaneo generato per tutelare la privacy. Se hai già un indirizzo IPv6 con un identificatore di interfaccia derivato da un indirizzo MAC, puoi risalire al MAC con il [convertitore da IPv6 a MAC](/it/tools/ipv6-address-to-mac-address-converter/).
