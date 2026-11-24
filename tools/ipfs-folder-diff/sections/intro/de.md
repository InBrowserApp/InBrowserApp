## Zwei IPFS-Ordner-CIDs vergleichen

Fügen Sie die Adresse des ursprünglichen Ordners in **Älterer Ordner** und die des aktualisierten Ordners in **Neuerer Ordner** ein. Wählen Sie dann **Ordner vergleichen**. Beide Felder akzeptieren eine CID, eine `ipfs://`-Adresse oder einen HTTP-Link zu einem Gateway. Geben Sie einen Pfad an, um zwei Unterordner zu vergleichen. Öffnen Sie ein Ergebnis, um seine CIDs zu sehen. Mit **Nach Pfad filtern** grenzen Sie die Liste ein. Mit **JSON herunterladen** speichern Sie den Vergleich.

## Wann gilt ein Pfad als hinzugefügt, entfernt oder geändert?

Ein Pfad, der nur in einem Ordner existiert, gilt als hinzugefügt oder entfernt. Ein vollständig hinzugefügter oder entfernter Unterordner erscheint als einzelner Pfad. Wenn ein Unterordner in beiden Versionen vorhanden ist und unterschiedliche CIDs hat, vergleicht das Tool seine Pfade. Die Liste der geänderten Pfade enthält Dateien oder symbolische Links mit unterschiedlichen CIDs sowie Pfade, deren Eintragstyp sich geändert hat. Wenn sich beim Import die Einstellungen für Segmentierung oder Kodierung unterscheiden, können Dateien verschiedene CIDs haben, auch wenn ihr sichtbarer Inhalt gleich ist.

## Versionen auf IPFS vergleichen, ohne alle Dateien herunterzuladen

Der Browser ruft verifizierte IPFS-Blöcke über öffentliche Gateways ab und überspringt Zweige, deren CIDs bereits übereinstimmen. So können Sie Versionen einer Website, eines veröffentlichten Datensatzes oder einer Sicherung anhand ihrer unveränderlichen Ordneradressen vergleichen. Geänderte Verknüpfungen lassen sich vergleichen, ohne die vollständigen Dateien herunterzuladen. Wenn ein Ordnereintrag nicht verfügbar ist, zeigt das Ergebnis die Pfade, die das Tool nicht vergleichen konnte.

Weitere Informationen zur [Inhaltsadressierung und Versionierung von Datensätzen](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).
