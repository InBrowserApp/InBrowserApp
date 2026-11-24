## Einen SPF-Eintrag prüfen

Füge den Wert eines einzelnen DNS-TXT-Eintrags ein, beginnend mit `v=spf1`, und wähle „Syntax prüfen“. Wird der TXT-Wert im DNS als mehrere Zeichenfolgen in Anführungszeichen angezeigt, füge sie in der angegebenen Reihenfolge zusammen. Lass die Leerzeichen innerhalb der Zeichenfolgen dabei unverändert. Die Prüfung zeigt jeden Mechanismus und Modifikator an und markiert Syntaxfehler direkt beim betroffenen Text. Die Eingabe bleibt in deinem Browser.

## So funktionieren SPF-Mechanismen und Qualifizierer

Mit SPF (Sender Policy Framework) legt eine Domain fest, welche Server in ihrem Namen E-Mails senden dürfen. Der empfangende Server prüft die Mechanismen der Reihe nach. So prüft `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` zunächst einen IPv4-Block und die SPF-Richtlinie eines Anbieters, bevor das abschließende `-all` greift. Qualifizierer geben das Ergebnis eines passenden Mechanismus an: Pass (`+`), Fail (`-`), Softfail (`~`) oder Neutral (`?`). Standardmäßig gilt `+`. Modifikatoren wie `redirect=` verwenden ein Gleichheitszeichen und haben keinen Qualifizierer.

## Was die Zahl der Terme mit DNS-Abfragen bedeutet

RFC 7208 erlaubt bei der SPF-Auswertung höchstens 10 Terme, die DNS-Abfragen auslösen. Die hier angezeigte Zahl zählt die möglichen Terme im eingefügten Eintrag, darunter `a`, `mx`, `include`, `exists`, `ptr` und ein aktives `redirect`. Über `include` oder `redirect` können weitere Terme hinzukommen. Ein passender Mechanismus kann die Auswertung vorzeitig beenden. Prüfe den veröffentlichten TXT-Eintrag und die darin referenzierten Domains, um eine aktive SPF-Richtlinie und die Gesamtzahl ihrer Terme mit DNS-Abfragen zu überprüfen.
