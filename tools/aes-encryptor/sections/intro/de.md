# Was ist AES-Verschluesselung?

AES ist ein symmetrischer Verschluesselungsalgorithmus. Das bedeutet, dass dasselbe Geheimnis zum Verschluesseln und Entschluesseln der Daten verwendet wird. Dieses Tool laeuft vollstaendig in Ihrem Browser und verwendet die Web Crypto API, sodass Klartext, Passwoerter und ausgewaehlte Dateien nicht hochgeladen werden.

Der Standardmodus ist AES-GCM, weil er die Ausgabe verschluesselt und authentifiziert. Authentifizierung ist wichtig: Wenn Chiffretext, Salt oder IV spaeter veraendert werden, sollte die Entschluesselung fehlschlagen, statt veraenderte Daten zurueckzugeben. AES-CBC und AES-CTR sind fuer Kompatibilitaet verfuegbar, authentifizieren Chiffretext aber fuer sich allein nicht.

## Wann Sie dieses Tool verwenden sollten

Verwenden Sie es, wenn Sie eine Notiz, ein Token, einen Konfigurationsausschnitt oder eine kleine Datei schuetzen muessen, bevor Sie sie ueber einen anderen Kanal speichern oder teilen. Die Ausgabe ist eine JSON-Huelle mit Modus, Einstellungen zur Schluesselableitung, Salt, IV und Chiffretext, sodass diese Parameter fuer den passenden Entschluesselungsschritt zusammenbleiben.

Bei passwortbasierter Verschluesselung wird das Passwort mit PBKDF2 und einem zufaelligen Salt verarbeitet. Erhoehen Sie die Iterationszahl, wenn Sie langsamere Verschluesselung und Entschluesselung tolerieren koennen. Fuer Verschluesselung mit rohem Schluessel fuegen Sie einen hexadezimalen Schluessel mit exakt der ausgewaehlten Laenge ein: 32 Hex-Zeichen fuer 128 Bit, 48 fuer 192 Bit oder 64 fuer 256 Bit.

## Praktische Hinweise

Bewahren Sie das Passwort oder den rohen Schluessel getrennt vom verschluesselten JSON auf. Jede Person mit dem JSON und dem Schluesselmaterial kann die Daten entschluesseln. Wenn Sie eine Datei verschluesseln, laden Sie das JSON-Ergebnis herunter und bewahren Sie den urspruenglichen Dateinamen separat auf, falls dieser Kontext wichtig ist.

Verwenden Sie einen manuellen IV nicht erneut mit demselben Schluessel. Dieses Tool erzeugt fuer jeden Lauf einen neuen IV und Salt, was die sicherere Voreinstellung ist. Bevorzugen Sie AES-GCM, es sei denn, ein anderes System erfordert ausdruecklich AES-CBC oder AES-CTR.
