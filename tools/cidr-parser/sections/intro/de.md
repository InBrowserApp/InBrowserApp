CIDR Parser macht aus einem Block wie `10.24.8.19/21` oder `2001:db8:abcd::123/64` das Netzwerk, das du tatsächlich meinst. Er normalisiert Hostadress-Eingaben, zeigt das kanonische Subnetz und legt die Grenzen offen, die du meist für Firewallregeln, Dokumentation oder Größenprüfungen brauchst.

## Was es zeigt

Das Ergebnis beginnt mit einer kurzen Übersicht und zerlegt den Block danach in praktische Details: kanonisches CIDR, gesamte und nutzbare Adressanzahl, Bereichsstart und -ende sowie die Integerwerte hinter dem Block. Für IPv4 erhältst du zusätzlich Netzmaske, Wildcard-Maske und Broadcast-Adresse. Für IPv6 bleibt der Ablauf gleich, Felder ohne Bedeutung werden ausgeblendet.

## Warum Kanonisierung wichtig ist

Viele eingefügte CIDR-Werte enthalten Host-Bits. Für Menschen ist das bequem, Router, ACLs und Dokumentation brauchen aber meist die kanonische Netzwerkadresse. Wenn der Block vor dem Kopieren umgeschrieben wird, lassen sich Off-by-one-Annahmen früher erkennen.

## Praktische Hinweise

- IPv4-Blöcke `/31` und `/32` werden als vollständig nutzbar behandelt, passend zu modernen Point-to-point- und Host-route-Szenarien.
- IPv6-Blöcke melden den gesamten Adressraum und nutzbaren Bereich, ohne ein Broadcast-Konzept zu erfinden.
- Alles läuft lokal im Browser, interne Subnetze verlassen die Seite während der Prüfung nicht.
