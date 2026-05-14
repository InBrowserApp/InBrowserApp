Die AES-Entschlüsselung stellt Klartext aus Daten wieder her, die mit demselben AES-Schlüsselmaterial verschlüsselt wurden. Dieses Tool ist für die JSON-Hülle ausgelegt, die vom InBrowser.App AES Encryptor erzeugt wird. Die Hülle hält Algorithmus, Einstellungen zur Schlüsselableitung, Salt, IV, Chiffretext und Klartext-Metadaten zusammen, während das Passwort oder der rohe Schlüssel getrennt bleibt.

Alle Vorgänge laufen lokal über die Web Crypto API des Browsers. Das verschlüsselte JSON, Passwort, der rohe Schlüssel und das entschlüsselte Ergebnis werden nicht hochgeladen.

## Wann Sie dieses Tool verwenden sollten

Verwenden Sie es, wenn Ihnen jemand eine `inbrowser-aes-v1`-JSON-Hülle gibt oder wenn Sie eine Notiz, ein Token, einen Konfigurationsausschnitt oder eine Datei wiederherstellen müssen, die Sie zuvor mit der passenden AES-Encryptor-Seite verschlüsselt haben.

Wenn die Hülle mit einem Passwort erstellt wurde, geben Sie dasselbe Passwort ein; das Tool verwendet den gespeicherten PBKDF2-Hash, die Iterationszahl, den Salt, den AES-Modus und die Schlüssellänge erneut. Wenn die Hülle mit einem rohen Schlüssel erstellt wurde, fügen Sie den exakten hexadezimalen Schlüssel mit der in der Hülle angegebenen Länge ein.

## Praktische Hinweise

AES-GCM authentifiziert die verschlüsselten Daten, sodass falsche Schlüssel oder geändertes JSON fehlschlagen sollten, statt veränderten Klartext zurückzugeben. AES-CBC und AES-CTR können kompatible Hüllen entschlüsseln, authentifizieren Chiffretext für sich allein aber nicht.

Bewahren Sie das Passwort oder den rohen Schlüssel getrennt von der JSON-Hülle auf. Jede Person mit Hülle und Schlüsselmaterial kann den Klartext wiederherstellen. Bei Datei-Hüllen verwendet der wiederhergestellte Download den ursprünglichen Dateinamen und Medientyp, die im JSON gespeichert sind.
