## Ein IPv6-ULA-Präfix (/48) erzeugen

Kopiere das erzeugte `fd`-Präfix für dein Heimnetz, deine Testumgebung oder dein VPN. Speichere das gewählte `/48` zusammen mit deiner Netzwerkkonfiguration, damit du es beim Hinzufügen von Subnetzen wiederverwenden kannst. Wähle **Neues Präfix erzeugen**, wenn du eine neue Zuweisung brauchst.

## Ein /64-Subnetz berechnen

Gib eine hexadezimale **Subnetz-ID** von `0000` bis `ffff` ein. Die ID `00a0` im Präfix `fd12:3456:789a::/48` ergibt zum Beispiel `fd12:3456:789a:a0::/64`. Ein `/48` bietet 65.536 mögliche `/64`-Subnetze. So kannst du dem LAN, dem Gäste-WLAN und dem VPN jeweils eigene Präfixe zuweisen.

## Woher das Präfix fd kommt

RFC 4193 definiert Unique Local Addresses im Bereich `fc00::/7`. Die lokal zugewiesene Hälfte `fd00::/8` beginnt mit `fd`. Für das `/48` ergänzt der Generator eine zufällige 40-Bit-Global-ID aus der Web Crypto API des Browsers.

## Wann sich eine Unique Local Address eignet

Eine ULA eignet sich für stabile IPv6-Adressen im eigenen Netz oder über Standorte hinweg, die per VPN verbunden sind. Ein Gerät kann parallel eine globale IPv6-Adresse für den öffentlichen Internetverkehr und seine ULA für interne Dienste verwenden.
