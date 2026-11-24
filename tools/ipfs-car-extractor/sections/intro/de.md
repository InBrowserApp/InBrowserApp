## CAR-Datei von IPFS oder Filecoin im Browser öffnen

Wählen Sie eine `.car`-Datei auf Ihrem Gerät aus. Das Tool liest das Archiv lokal und zeigt seine Wurzel-CID an. Wenn das Archiv mehrere Wurzeln enthält, wählen Sie die gewünschte aus. IPFS und Filecoin verwenden CAR-Archive (Content Addressable aRchives). Apples Ressourcenkataloge haben dieselbe Dateiendung und verwenden ein anderes Format.

## Dateien extrahieren oder einen Ordner aus einem CAR-Archiv als ZIP exportieren

Öffnen Sie einen Ordner, um seinen Inhalt zu sehen. Wählen Sie eine Datei aus und klicken Sie auf **Datei herunterladen**, um ihre ursprünglichen Bytes zu speichern. Wählen Sie **ZIP herunterladen**, um einen Ordner samt Unterordnern zu exportieren. Die Ordnerstruktur von UnixFS bleibt im ZIP-Archiv erhalten.

## Was bedeutet ein fehlender Block?

Ein CAR-Archiv speichert Inhalte in Blöcken, die durch CIDs identifiziert werden. Eine Wurzel kann auf Blöcke außerhalb eines unvollständigen Archivs verweisen. Fehlt für einen Eintrag ein benötigter Block, besorgen Sie einen vollständigen Export aus der Quelle oder laden Sie einen Eintrag herunter, dessen Blöcke vorhanden sind. CAR-Dateien können auch Daten in anderen IPLD-Formaten enthalten. Dieses Tool extrahiert Dateien und Ordner aus UnixFS. [CAR-Format von IPLD](https://ipld.io/specs/transport/car/)
