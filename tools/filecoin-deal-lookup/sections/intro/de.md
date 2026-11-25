## Filecoin-Speichervereinbarung per ID abrufen

Geben Sie die numerische **Vereinbarungs-ID** (Deal ID) einer Storage-Market-Vereinbarung im Filecoin-Mainnet ein und wählen Sie **Vereinbarung suchen**. **Beispiel ausprobieren** lädt einen öffentlichen Eintrag mit Status, Speicheranbieter, Kunde, Terminen und Piece-CID. Die Suche erfasst Vereinbarungen aus dem Storage Market. Filecoin Onchain Cloud verwendet eine eigene ID für Datensätze.

## Was der Status einer Filecoin-Speichervereinbarung bedeutet

Eine Vereinbarung ist aktiv, wenn ihre Aktivierung erfasst wurde und ihr geplantes Ende noch bevorsteht. Sie ist ausstehend, wenn sie auf die Aktivierung wartet und ihre geplante Startepoche noch nicht verstrichen ist. Die Suche zeigt auch Fälle an, in denen der Starttermin ohne Aktivierung verstrichen ist, die Vereinbarung abgelaufen ist oder im Marktstatus eine Sanktion vermerkt wurde. Die Epochen für Start und Ende stammen aus dem Vereinbarungsvorschlag. Die zugehörigen Termine in UTC werden aus dem Epochenzeitplan der Blockchain berechnet.

## Piece-CID der Vereinbarung mit Ihrer Datei vergleichen

Die Piece-CID ist das für das Filecoin-Piece erfasste Commitment. Kopieren Sie sie, um sie mit einem Commitment zu vergleichen, das der Filecoin-Piece-CID-Rechner aus Ihrer lokalen Datei oder Ihrem CAR-Archiv berechnet hat. Das Ergebnis zeigt auch die Piece-Größe mit Padding an. Sie wird nach dem Auffüllen des Filecoin-Piece gemessen. Eine verifizierte Vereinbarung trägt die Prüfkennzeichnung von Filecoin Plus.

## Ältere Filecoin-Speichervereinbarungen finden

Der Browser fragt zuerst den aktuellen Zustand des Speichermarkts im Filecoin-Mainnet ab. Wird eine Vereinbarung dort nicht mehr geführt, kann das Tool die von Filfox indexierten ursprünglichen Bedingungen anzeigen und als historischen Eintrag kennzeichnen. Diese Bedingungen umfassen die geplanten Termine und die beteiligten Parteien. **Auf Filfox ansehen** öffnet den Explorer für dieselbe Vereinbarungs-ID.

Welche Felder die Blockchain zurückgibt, erfahren Sie in der [RPC-Referenz zum Filecoin Storage Market](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal).
