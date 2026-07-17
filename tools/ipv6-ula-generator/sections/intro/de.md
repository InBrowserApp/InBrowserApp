## Was ist eine IPv6 Unique Local Address?

Eine IPv6 Unique Local Address (ULA, eindeutige lokale IPv6-Adresse) ist für die Kommunikation innerhalb von Standorten, privaten Netzwerken und verbundenen Organisationen vorgesehen. Der gesamte ULA-Adressraum ist `fc00::/7`. Sein achtes Bit ist das **L-Bit**: Der Wert `1` wählt den von diesem Generator verwendeten, lokal zugewiesenen Bereich `fd00::/8`, während die Hälfte `fc00::/8` für ein anderes Zuweisungsverfahren reserviert bleibt.

ULAs sind standardmäßig nicht global erreichbar. „Lokal“ bedeutet jedoch weder geheim noch automatisch sicher. Sie können die Grenzen gerouteter Standorte, VPNs und private Verbindungen passieren, wenn Betreiber diese Pfade konfigurieren.

## Wie dieser Generator gemäß RFC 4193 ein /48 erzeugt

Dieser Generator gemäß RFC 4193 fordert über die Web Crypto API genau 40 Zufallsbits an und kombiniert sie mit `fd`. Das Ergebnis ist ein statistisch eindeutiges 48-Bit-Standortpräfix wie `fd12:3456:789a::/48`. Die Erzeugung findet im Browser statt: Dabei werden keine MAC-Adresse, kein Zeitstempel, keine Gerätekennung und keine Serverantwort erfasst.

Es gibt `2^40` mögliche Global-IDs – etwa 1,1 Billionen. Kryptografisch sicherer Zufall macht eine versehentliche Wiederverwendung unwahrscheinlich, kann aber nicht garantieren, dass zwei unabhängig erzeugte Präfixe niemals kollidieren. Dokumentiere das ausgewählte `/48` in deiner Netzwerkdokumentation und verwende es durchgängig wieder.

## Planung der 65.536 verfügbaren /64-Subnetze

Auf das Standortpräfix `/48` folgt eine 16-Bit-Subnetz-ID. Die Werte von `0000` bis `ffff` ergeben 65.536 mögliche `/64`-Netzwerke. Beispielsweise wird aus `fd12:3456:789a::/48` mit der Subnetz-ID `00a0` das kanonische Netzwerk `fd12:3456:789a:a0::/64`.

Die übrigen 64 Bit bilden die Schnittstellen-ID. Dieses Tool plant ausschließlich Netzwerkpräfixe; es erzeugt weder `/128`-Hostadressen noch leitet es Schnittstellen-IDs aus MAC-Adressen ab.

## Wo ULAs hingehören – und wo nicht

ULAs eignen sich gut für stabile interne Adressierung, per VPN verbundene Standorte, Labornetzwerke und Dienste, die ein internes Präfix beibehalten und zugleich globales Unicast-IPv6 verwenden sollen. Sie sind weder eine Firewall noch eine inhärente Sicherheitsgrenze. Wende die üblichen Zugriffskontrollen an, filtere ungeeigneten ULA-Verkehr an Standortgrenzen und halte interne ULA-Einträge aus dem öffentlichen DNS heraus.

Ein Host kann gleichzeitig eine ULA und eine globale Unicast-Adresse verwenden. Verwende die globale Adresse für die Internet-Erreichbarkeit und das dauerhafte ULA-Präfix für die privaten Pfade, die es benötigen.
