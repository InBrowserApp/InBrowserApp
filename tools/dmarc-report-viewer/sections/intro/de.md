## Einen DMARC-Sammelbericht lesen

Öffne den Anhang eines Sammelberichts, der an die `rua`-Adresse in deinem DMARC-Eintrag gesendet wurde. Der Betrachter akzeptiert XML, GZIP und ZIP-Dateien mit einem XML-Bericht. Du kannst auch den XML-Text einfügen oder das Beispiel laden. Die Berichtsübersicht zeigt, wer den Bericht gesendet hat, den Zeitraum in UTC und die veröffentlichte Richtlinie der Domain. Dateien und eingefügter Text werden im Browser verarbeitet.

## Was die Nachrichtenanzahlen bedeuten

Jeder Eintrag fasst Nachrichten mit derselben Quell-IP und demselben Prüfergebnis zusammen. Ein Eintrag kann mehrere Nachrichten umfassen, und dieselbe IP-Adresse kann in mehreren Einträgen erscheinen. Die Gesamtwerte ergeben sich aus der Nachrichtenanzahl jeder Zeile. Eine Nachricht besteht DMARC, wenn SPF oder DKIM erfolgreich ist und die jeweilige Domain nach den DMARC-Regeln zur sichtbaren From-Domain passt. Der Betrachter zählt eine Nachricht als fehlgeschlagen, wenn beide Domainabgleiche fehlschlagen. Unvollständige Angaben zum Domainabgleich erscheinen als unbekannt.

## Warum Domainabgleich, Authentifizierung und Maßnahme voneinander abweichen können

Klappe „Unveränderte Authentifizierungsergebnisse“ auf, um die gemeldeten Domains, Ergebnisse und DKIM-Selektoren zu sehen. Eine SPF- oder DKIM-Prüfung kann für eine andere Domain erfolgreich sein und trotzdem den DMARC-Domainabgleich verfehlen. Die angewandte Maßnahme zeigt, wie der Empfänger mit der jeweiligen Nachrichtengruppe umgegangen ist. Sie kann von der veröffentlichten Richtlinie abweichen, wenn der Empfänger eine Ausnahme anwendet. Filtere nach Quell-IP oder From-Domain, um einen Absender zu untersuchen. Die Gesamtwerte bleiben dabei gleich.

## Unterstützte DMARC-XML-Formate

Der Betrachter liest Sammelberichte nach RFC 9990 einschließlich des zugehörigen DMARC-Namensraums sowie ältere Berichte nach RFC 7489. RFC 9990 beschreibt das XML-Format, in dem Sammelberichte die Authentifizierung und die angewandten Maßnahmen zusammenfassen. Enthält ein Archiv deines E-Mail-Systems mehrere Berichte, entpacke den gewünschten Bericht und öffne ihn einzeln.
